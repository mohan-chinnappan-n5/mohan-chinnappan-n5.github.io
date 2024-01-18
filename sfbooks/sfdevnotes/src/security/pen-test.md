# Penetration (pen) Testing




Penetration testing, or **pen testing** for short, is the process of testing a website or other digital system for vulnerabilities that could be exploited by attackers. Penetration testing typically involves **simulating** various types of **attacks** to see how the system responds and to identify potential weaknesses that could be exploited by attackers.


## Steps

- Note:  Unauthorized pen testing is illegal and could result in criminal charges.Take appropriate precautions to avoid causing any harm or disruption to the website or its users during the testing process


|Step|Description|
|---|---|
|1. Define the scope of the test|Determine what **parts** of the website will be tested, what types of attacks will be simulated, and any limitations or constraints that need to be taken into consideration.|
|2. Reconnaissance/Scouting|Conduct a thorough reconnaissance of the website and any associated systems to identify potential vulnerabilities or weaknesses.Ping probes, port scanning, or ```traceroute``` or finger-printing are practical examples of active reconnaissance.
|3. Vulnerability scanning|Use automated tools to scan the website and associated systems for known vulnerabilities. Example: QL injection or cross-site scripting (XSS) vulnerabilities.|
|4. Manual testing|Perform manual testing to identify any additional vulnerabilities or weaknesses that may **not have been identified by automated tools**.|
|5. Exploitation|Attempt to exploit any vulnerabilities that have been identified to see if they can be used to **gain unauthorized access** or perform other malicious activities.|
|6. Reporting| Document all findings and provide recommendations for remediation|


## Reconnaissance/Scouting 

The process of gathering information about a target system or network before attempting to launch a pen testing. It is an important step since it helps the tester to identify potential vulnerabilities and weaknesses in the target system, network or application.


|Step|Description|
|---|---|
|Passive reconnaissance|This involves gathering information about the target system, network or application without actively engaging with it. This includes searching for information on search engines, social media, and other publicly available sources.|
|Active reconnaissance| This involves actively engaging with the target system, network or application to gather information. This includes techniques such as port scanning, network mapping, and fingerprinting.|
|Social engineering|This involves using psychological manipulation to gather information from people associated with the target system, network or application. This includes techniques such as phishing, pre-texting, and baiting.|
|Open-source intelligence (OSINT)|This involves gathering information from publicly available sources such as company websites, job postings, and news articles.|





## Vulnerability scanning

|Step|Description|
|---|---|
|1. Planning|Identify the scope of the scan, including the systems, networks, or applications to be scanned, and the types of vulnerabilities to be checked.|
|2. Scanning|Use a vulnerability scanning tool to scan the target systems, networks, or applications to identify vulnerabilities, misconfigurations, or weak points that could be exploited.|
|3. Analysis|Review the scan results to prioritize the vulnerabilities based on their severity, potential impact, and exploitability.|
|4. Reporting|Generate a report that summarizes the vulnerabilities found, their severity, and recommendations for remediation|
|5. Remediation|Address the vulnerabilities by applying patches, updating configurations, or implementing other measures to mitigate the identified risks|

### Vulnerability scanning Tools for Linux
|Tool|Description|
|---|---|
|[OpenVAS](https://en.wikipedia.org/wiki/OpenVAS)|Can detect thousands of known vulnerabilities in Linux systems. It includes a web-based user interface and can be configured to run scheduled scans.|
|[Nikto](https://en.wikipedia.org/wiki/Nikto_(vulnerability_scanner))|Can identify vulnerabilities in web servers and web applications running on Linux systems. It includes over 6,700 checks for potential vulnerabilities and misconfigurations.|
|Nmap - [Network Mapper](https://en.wikipedia.org/wiki/Nmap)|Network scanner that can identify open ports, running services, and potential vulnerabilities in Linux systems. It includes a wide range of features, including version detection and OS fingerprinting.|
|[Lynis](https://en.wikipedia.org/wiki/Lynis)|Security auditing tool that can identify vulnerabilities in Linux systems. It includes over 200 tests for security and compliance |



## Sample Pen Test Report


|Section|Description|
|---|---|
|Executive Summary|Provides a high-level overview of the penetration test results, including the scope, objectives, key findings, and recommendations for remediation.|
|Scope and Methodology|Outlines the scope of the penetration test, including the systems, networks, or applications tested, and the methodology used to conduct the test.|
|Vulnerabilities|Provides a detailed description of the vulnerabilities found during the test, including their severity, potential impact, and recommendations for remediation.|
|Exploitation|Provides details on how the vulnerabilities were exploited during the test, including the tools and techniques used.|
|Recommendations|Provides recommendations for remediation, including prioritization of vulnerabilities and specific steps to be taken to address the identified risks.|
|Conclusion|Summarizes the key findings and recommendations of the penetration test, and emphasizes the importance of addressing the identified vulnerabilities to improve the overall security of the organization|
|Appendices|Includes additional information such as network diagrams, screenshots, and raw data from the penetration test.


