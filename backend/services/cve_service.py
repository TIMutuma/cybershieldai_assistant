import os
import requests
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()


class CVEService:

    BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    NVD_API_KEY = os.getenv("NVD_API_KEY")

    @classmethod
    def _get_headers(cls) -> Dict:
        """Get request headers with API key if available"""
        headers = {"User-Agent": "CyberShield-AI"}
        if cls.NVD_API_KEY:
            headers["api-key"] = cls.NVD_API_KEY
        return headers

    @classmethod
    def search_cves(
        cls,
        keyword: str,
        limit: int = 10
    ) -> List[Dict]:

        response = requests.get(
            cls.BASE_URL,
            params={
                "keywordSearch": keyword,
                "resultsPerPage": limit
            },
            headers=cls._get_headers(),
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        vulnerabilities = data.get(
            "vulnerabilities",
            []
        )

        results = []

        for item in vulnerabilities:

            cve = item.get("cve", {})

            results.append(
                cls.extract_cve_data(cve)
            )

        return results

    @classmethod
    def get_cve(
        cls,
        cve_id: str
    ) -> Dict:

        response = requests.get(
            cls.BASE_URL,
            params={
                "cveId": cve_id
            },
            headers=cls._get_headers(),
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        vulnerabilities = data.get(
            "vulnerabilities",
            []
        )

        if not vulnerabilities:
            return {
                "error": "CVE not found"
            }

        return cls.extract_cve_data(
            vulnerabilities[0]["cve"]
        )

    @classmethod
    def extract_cve_data(
        cls,
        cve: Dict
    ) -> Dict:

        cve_id = cve.get("id")

        descriptions = cve.get(
            "descriptions",
            []
        )

        description = "No description available"

        for d in descriptions:
            if d.get("lang") == "en":
                description = d.get(
                    "value",
                    description
                )
                break

        metrics = cve.get(
            "metrics",
            {}
        )

        cvss_score = None

        if "cvssMetricV31" in metrics:

            cvss_score = metrics[
                "cvssMetricV31"
            ][0]["cvssData"]["baseScore"]

        elif "cvssMetricV30" in metrics:

            cvss_score = metrics[
                "cvssMetricV30"
            ][0]["cvssData"]["baseScore"]

        elif "cvssMetricV2" in metrics:

            cvss_score = metrics[
                "cvssMetricV2"
            ][0]["cvssData"]["baseScore"]

        severity = cls.calculate_severity(
            cvss_score
        )

        weaknesses = []

        for weakness in cve.get(
            "weaknesses",
            []
        ):
            for desc in weakness.get(
                "description",
                []
            ):
                weaknesses.append(
                    desc.get("value")
                )

        references = [
            ref.get("url")
            for ref in cve.get(
                "references",
                []
            )
        ]

        return {
            "cve_id": cve_id,
            "description": description,
            "cvss_score": cvss_score,
            "severity": severity,
            "weaknesses": weaknesses,
            "references": references[:5]
        }

    @classmethod
    def calculate_severity(
        cls,
        score
    ):

        if score is None:
            return "UNKNOWN"

        if score >= 9.0:
            return "CRITICAL"

        if score >= 7.0:
            return "HIGH"

        if score >= 4.0:
            return "MEDIUM"

        if score > 0:
            return "LOW"

        return "NONE"

    @classmethod
    def summarize_cve(
        cls,
        cve_id: str
    ):

        cve = cls.get_cve(cve_id)

        if "error" in cve:
            return cve

        return {
            "cve_id": cve["cve_id"],
            "severity": cve["severity"],
            "cvss_score": cve["cvss_score"],
            "description": cve["description"],
            "recommendation": cls.recommendation(
                cve["severity"]
            )
        }

    @classmethod
    def recommendation(
        cls,
        severity: str
    ):

        recommendations = {
            "CRITICAL":
                "Patch immediately and investigate exposure.",
            "HIGH":
                "Prioritize remediation as soon as possible.",
            "MEDIUM":
                "Schedule remediation and monitor systems.",
            "LOW":
                "Address during routine maintenance.",
            "UNKNOWN":
                "Review vulnerability manually."
        }

        return recommendations.get(
            severity,
            "Review manually."
        )