Hyperforce is based on five key architectural principles: 
- Immutable Infrastructure, 
- Multi-Availability-Zone Design
- Zero Trust approach to security
- the idea of Infrastructure-As-Code, 
- Commitment to starting with a Clean Slate. 
---
1. **Immutable Infrastructure**
Hyperforce resources (containers, services, networks, etc) are immutable
- Once the resource is in place, rather than making patches or changes to it directly in our production environment, we replace it wholesale with an updated version.
- Maintains: predictable state by eliminating configuration drift. 

---
2. **Multi-Availability-Zone (AZ) Design**
-  Public cloud (like AWS, Google Cloud...) to guarantee high availability. 
- Compute resources (like services or data storage technologies) are deployed across (at least) three availability zones within a given region, which are close enough in physical proximity to act as a single system, but cleanly separated so that they don’t share any single points of failure, like power systems, air conditioning, network connections, etc. 
- This allow us to withstand the inevitable occasional fault (like a hardware failure, or power supply interruption) and continue to be available. We carefully monitor every service in Hyperforce to ensure high availability.
---

3. **Zero Trust:** Never trust, always verify.
-  There is no implicit access to resources in the system, even from other components that are part of the same system;
-  All request paths are explicitly authenticated and authorized, and all data is encrypted, both at rest and over the wire.
-  Principle of least privilege is used to ensure operators who need access to production get that access in an elastic (JIT)  with the right level of privilege
-  Automated removal of that access after a period of time
---
4. **Infrastructure as Code :**
- Infrastructure is managed using explicit metadata artifacts that are kept under source control
- Reduces  vulnerability or bug through human error, and it guarantees that changes to the infrastructure follow the same lifecycle as any other part of our software system 
---
5. **Clean Slate :** not a lift and shift
- Re-envision current practices in a cloud-native way, with uncompromising security and availability as the non-negotiable bedrock of our approach.
- Ubiquitous system monitoring, active detection and response to security threats
---
References:
- [Behind the Scenes of Hyperforce: Salesforce’s Infrastructure for the Public Cloud](https://engineering.salesforce.com/behind-the-scenes-of-hyperforce-salesforces-infrastructure-for-the-public-cloud-429309542d8e/)
- [The Unified Infrastructure Platform Behind Salesforce Hyperforce](https://engineering.salesforce.com/the-unified-infrastructure-platform-behind-salesforce-hyperforce-ad8f4c2cf789/?source=friends_link&sk=54cb6328080b7991a028d3ff086b7ec1)0
