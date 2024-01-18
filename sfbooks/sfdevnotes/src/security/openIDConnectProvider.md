# OpenID Connect (OIDC) Provider




## Coding
- Configure your provider 
   - You need to configure your provider :
    -  specifying the issuer URL
    -  the client ID and secret, 
    -  the scopes you want to use.
- Implement the **authorization endpoint** ```/authorize```
    - This endpoint handles user authentication and authorization
    - When a user attempts to log in, they will be **redirected to this endpoint**
    - You will need to prompt the user to log in and **authorize** the **requested scopes**



## Salesforce Configuration

|URL|Link|
|---|---|
|Test-Only Initialization URL|	https://mohansun-ea-02-dev-ed.my.salesforce.com/services/auth/test/Google|
|Single Sign-On Initialization URL|	https://mohansun-ea-02-dev-ed.my.salesforce.com/services/auth/sso/Google|
|Existing User Linking URL|	https://mohansun-ea-02-dev-ed.my.salesforce.com/services/auth/link/Google|
|OAuth-Only Initialization URL|	https://mohansun-ea-02-dev-ed.my.salesforce.com/services/auth/oauth/Google|
|Callback URL|	https://mohansun-ea-02-dev-ed.my.salesforce.com/services/authcallback/Google|
|Single Logout URL|	https://mohansun-ea-02-dev-ed.my.salesforce.com/services/auth/rp/oidc/logout|


## Google OIDC Provider Configuration
|URL|Link|
|---|---|
|Authorize Endpoint URL|https://accounts.google.com/o/oauth2/auth|
|Token Endpoint URL|https://accounts.google.com/o/oauth2/token|
|User Info Endpoint URL|https://www.googleapis.com/oauth2/v3/userinfo|


### AUthorization end point
![Sample client](https://github.com/mohan-chinnappan-n/cli-dx/raw/master/oid/img/auth-provide-google-1.png)

#### Digging deeper...
```
curl 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fservices%2Fauthcallback%2FGoogle&scope=email+openid++profile&state=CAAAAYcyiOKSMDAwMDAwMDAwMDAwMDAwAAAA8muQ9vyTuOZ1uRL1-H30_n-abNbVuoLO32Tl1OlRdT-uaHJrpKY_02vYBvWlWtOxWsB0wODRqoyDZD6MyteiJcRmkeEQQFxjZXB-_lWFAjHW4brvhjPGWGoOCGyI1-NbUElsg_sbNRqfHBqKtmPCxR39uK8hAu88cAEKitoJUchOMhSa6TLbN1puVbOBQUQUY4gtawZ7wyNCfSQ5VDP0G6x7_EwYHpfCgbtv5zee_OGw0jSrRDGFh3hwN14bw6NJyw%3D%3D' \
  -H 'authority: accounts.google.com' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cookie: SMSV=ADHTe-A4DYNhjtsQ9HsUTQtFvTNXHpLdZ04HxHbq7iwzxSqKK8K1AP3E3E1_jd0rItdNoqGd650_Sc-1cX0tvT8Cz7hqzClpq3a4YziVdbSO7lM61qvI4mI; LSOLH=_SVI_EPbFnLSe1PsCGA0iP01BRURIZl9xN1ZKemF1eGVDaHl1aGU2aVVZNk0zRVFESW1aSGpVWW1QVFNRVUV3dFVBVkwzWU5CNVh2NnBzQQ_:27829248:f334; ACCOUNT_CHOOSER=AFx_qI7V7VEYJej7Ykov04Vrzq5A4_lDKibmV59PmAF20VUie91gKs9wCHS1je3okc4e0Ash2J7IggG8rH_w9TIvFyLAmqCzLzReX9DHCyqfRWF9JW6Ay95sd9pW9Jj1chlVpYuldJuIsif1joMKWgghl4h5Y8PpLbmskYC_j4UcuLil6STA7rLWALpbBtClLyv8V4maNfl933_2cnloK8fgGF0OAXPHvPfOuX3i1eccntjfP2WnCVq1E5eO7PHG3WbS0ieW9HhAiBbAf7KPbQqVewLHt6S_o61MV-sfm1SxpYwXsd760WHCO-N2Wkt7od4dRoI_dM57nVf_LAJzp2Myl8WYTp27jU_c9rq4lVAkZO5EgxDo8xE; user_id=102467670031694452102; SID=Ugi1I85WSY9C5ab3s1crnWPFArrjJ9281xpuc75ZTh9aCJMbzZE_SzFdwcD9bTdPo9Bucw.; __Secure-1PSID=Ugi1I85WSY9C5ab3s1crnWPFArrjJ9281xpuc75ZTh9aCJMbIZaMWo88ze8emst2djLA6Q.; __Secure-3PSID=Ugi1I85WSY9C5ab3s1crnWPFArrjJ9281xpuc75ZTh9aCJMbfLml6pHozIpG1K4nIG1rFw.; LSID=o.calendar.google.com|o.chat.google.com|o.drive.google.com|o.groups.google.com|o.lens.google.com|o.mail.google.com|o.meet.google.com|o.play.google.com|o.store.google.com|s.blogger|s.youtube:Ugi1I8tfct6dQOO-qPyKgV4Ha29QOMbZr5ctdnf3Sf9HqxsPZd14eK8G30Swws7LSup9Ag.; __Host-1PLSID=o.calendar.google.com|o.chat.google.com|o.drive.google.com|o.groups.google.com|o.lens.google.com|o.mail.google.com|o.meet.google.com|o.play.google.com|o.store.google.com|s.blogger|s.youtube:Ugi1I8tfct6dQOO-qPyKgV4Ha29QOMbZr5ctdnf3Sf9HqxsPDhMdmIlVdR8c5dtYsdoWGg.; __Host-3PLSID=o.calendar.google.com|o.chat.google.com|o.drive.google.com|o.groups.google.com|o.lens.google.com|o.mail.google.com|o.meet.google.com|o.play.google.com|o.store.google.com|s.blogger|s.youtube:Ugi1I8tfct6dQOO-qPyKgV4Ha29QOMbZr5ctdnf3Sf9HqxsPOZdCNWhVBl79ZqQKnP6BAA.; HSID=AbpN7mtQ4ZrFiXUmT; SSID=A9My-LpWUK-E4r7AG; APISID=IbDmx8r0qLbrL-RR/AmOxvGGxLvSzxnsgI; SAPISID=eJ_nQyk1nKB5iKMM/AVN6ZTGMq7qWxaEVu; __Secure-1PAPISID=eJ_nQyk1nKB5iKMM/AVN6ZTGMq7qWxaEVu; __Secure-3PAPISID=eJ_nQyk1nKB5iKMM/AVN6ZTGMq7qWxaEVu; AEC=AUEFqZeU5ix63mgATKsT_B_8nJ5HMCvzMz865MhcSRFZkaImjtODFIogmw; NID=511=IjViYjqGfKANVt5V2z5b9pOeE6BacqtY7fuRlwNz-Oilmm3XhWFjSYUMG6YZJoRcIxPaQUilDoK8RDBz0LM0GkaCLVI8M1QffX4K-2N65AZ_gNUIfrwgP-KuRWGjoY-INvYwBfYjR7gESIj127KE9Ur6UkSVB3_qdfhdd37oHmQKbhmOckrzXwo8LiEtX08X-UA9yEbTHWjtQyRZUV3J2utDBl9omh1YFRteY4uss5AuL8J4NW5VUtUiVLZlcxuWJjjgarXg_EJz0OJ0F9q9jRPIyb2GHO9rnDpedHgun-z5MvuarhMgtdrk5jevwIRAN1WAh2HBpQoIYXMUpTaURroFSK7W1SuHG3Rk5FyoNpLFvJEdMNopCe3g4jLlIzMM; 1P_JAR=2023-03-30-12; __Host-GAPS=1:ZyvvyOwHAegzD3RyYvG5p98L6wA_zhvWdfbbqHx-lRSKP05LryST18rKEZfAxVCdMQTvucTa993UgRV_E9zZO1BTgKv4bw:IyvRFMgyJdq7vjgn; SIDCC=AFvIBn8xSu6nUAArPyQcTCvydpPlThjwVbbivL-8sNeWkRx5iHw_yvBJZH96HxHeyVDuwxY50F8R; __Secure-1PSIDCC=AFvIBn8H1BlHixXBGGbs5mqbhQjz3Tmc9KpJeZjEuyjEDbuTZd0dQm3OpMgTbNqAUz5QHbXWWs4; __Secure-3PSIDCC=AFvIBn_ZDNglnMEA17ZnzPuhdmQ8DwiVezhvI4B1iOTnRJMVfEYQjWwwHQbPRkk1OVu61guANIo' \
  -H 'referer: https://mohansun-ea-02-dev-ed.my.salesforce.com/' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-arch: "x86"' \
  -H 'sec-ch-ua-bitness: "64"' \
  -H 'sec-ch-ua-full-version: "111.0.5563.146"' \
  -H 'sec-ch-ua-full-version-list: "Google Chrome";v="111.0.5563.146", "Not(A:Brand";v="8.0.0.0", "Chromium";v="111.0.5563.146"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-model: ""' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-ch-ua-platform-version: "13.2.1"' \
  -H 'sec-ch-ua-wow64: ?0' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  -H 'x-chrome-id-consistency-request: version=1,client_id=77185425430.apps.googleusercontent.com,device_id=6774b99a-0361-4feb-8398-814743d0a935,signin_mode=all_accounts,signout_mode=show_confirmation' \
  --compressed
  ```

```
url = 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fservices%2Fauthcallback%2FGoogle&scope=email+openid++profile&state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA%3D%3D'

const urlParsed = new URL(url);
urlParsed
URL {origin: 'https://accounts.google.com', protocol: 'https:', username: '', password: '', host: 'accounts.google.com', …}hash: ""host: "accounts.google.com"hostname: "accounts.google.com"href: "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fservices%2Fauthcallback%2FGoogle&scope=email+openid++profile&state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA%3D%3D"origin: "https://accounts.google.com"password: ""pathname: "/o/oauth2/auth"port: ""protocol: "https:"search: "?response_type=code&client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fservices%2Fauthcallback%2FGoogle&scope=email+openid++profile&state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA%3D%3D"searchParams: URLSearchParams {}username: ""[[Prototype]]: URL

urlParsed.search
'?response_type=code&client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fservices%2Fauthcallback%2FGoogle&scope=email+openid++profile&state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA%3D%3D'

urlParsed.search.split('&')
(5) ['?response_type=code', 'client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com', 'redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.m…salesforce.com%2Fservices%2Fauthcallback%2FGoogle', 'scope=email+openid++profile', 'state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0t…Y8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA%3D%3D']

Object.assign({}, urlParsed.search.split('&') ); 
{
  0: '?response_type=code', 
  1: 'client_id=113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com', 
  2: 'redirect_uri=https%3A%2F%2Fmohansun-ea-02-dev-ed.m…salesforce.com%2Fservices%2Fauthcallback%2FGoogle', 
  3: 'scope=email+openid++profile', 
  4: 'state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0t…Y8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA%3D%3D'
}

```

```
response_type: code
client_id: 113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com
redirect_uri: https://mohansun-ea-02-dev-ed.my.salesforce.com/services/authcallback/Google
scope: email openid  profile
state: CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA==

```

- Consent 
```

https://accounts.google.com/signin/oauth/consent?authuser=0&part=AJi8hAPPKVJYXZWoTwsAvFBuRYB7qFqGMagu55E253ysGRFqZgWZMdOjqEMP5YqvtEdf0B566yMiguqZSSZ4lbgsLdyErCN7Zmibhm9pjMTeJsy4kIibA-O8lK314NlUmbAVPEyLNZ8AbCQkVbBb_9qAdHxdEK7rkD0KJbOhKcFL0BO_SNbUbwQLmABvm3r7uorry7AuxtvDw1w1ok8CI6u08IDtVKXx5LnDSjFvn1U93GRtxT4DfklSsDbHjcPTB-a7Qj_98dbo0L9FojzSq1l8IltdnWL6YvT0GkXO_WVHb5Mh5Iu8vpDaBD1vaYCIlG5A


authuser: 0
part: AJi8hAPPKVJYXZWoTwsAvFBuRYB7qFqGMagu55E253ysGRFqZgWZMdOjqEMP5YqvtEdf0B566yMiguqZSSZ4lbgsLdyErCN7Zmibhm9pjMTeJsy4kIibA-O8lK314NlUmbAVPEyLNZ8AbCQkVbBb_9qAdHxdEK7rkD0KJbOhKcFL0BO_SNbUbwQLmABvm3r7uorry7AuxtvDw1w1ok8CI6u08IDtVKXx5LnDSjFvn1U93GRtxT4DfklSsDbHjcPTB-a7Qj_98dbo0L9FojzSq1l8IltdnWL6YvT0GkXO_WVHb5Mh5Iu8vpDaBD1vaYCIlG5AuPU6JRCQY1a5SGdDLribsqCPzuE9z9wrqbmU_iFHpcl8vhdGBnqLoEjkNgzmb3V6TlxWAkWEuti6r8y8dkWuduYd0rGcRersJ_pD3f8rtHT00IVTu0mB7tGgN6UEWb8rey9D4v6jxgK_el8fXIFiAByfO1ni_1pZj1DWvRvp4IDRYzowLa4oxU0GSPZNTmRdT9r-qCMC
as: S-1290867910:1680177605126845
client_id: 113225562349-fqktafcmesni74spapbj1ep0pvja4oor.apps.googleusercontent.com
pli: 1
rapt: AEjHL4PiKkA1sGph8xQqIaNrSv-lknPQyYaBt15Hc4GkzOB7AwQX-wQTo3W-dsAfETT82g0Ybf3TmqLglD1kasQo5QkGWw5mPA

```


```
https://mohansun-ea-02-dev-ed.my.salesforce.com/services/authcallback/Google?state=CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA==&code=4/0AVHEtk7MijYSTwo9rTHxlZksTZHx7ua6suRe3d9ISEVIPGhQNazKbJqPabgNko1gukZumw&scope=email+profile+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+openid&authuser=0&prompt=none

```

```
state: CAAAAYcycWR5MDAwMDAwMDAwMDAwMDAwAAAA8vlkOR0tObD2YFyIGcyW5uNODCoVk-UbAFB67fKsPwsXLPrGFjlfWXpi9CQQgfXdm06to3jqNofBSOe4DvcoyDzCBtvnUrkrCTL9to_CblC3Qj4L48_E1vvIvjXlmVzjnSGRBiWYyu2GX8mups7UUBk9u8z7K1r-6VlBx3e6bt7ovlSqMeSz1-DUYuDKBI3pcBGTpgqmTbuCZE_6wi2LC7QY8Bo29ETSb4aakGKRGJb2Vx78NSMUODioVO4ZmGr9CA==
code: 4/0AVHEtk7MijYSTwo9rTHxlZksTZHx7ua6suRe3d9ISEVIPGhQNazKbJqPabgNko1gukZumw
scope: email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid
authuser: 0
prompt: none

```

```
curl 'https://mohansun-ea-02-dev-ed.file.force.com/secur/contentDoor?startURL=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fsetup%2FforcecomHomepage.apexp%3Fsetupid%3DForceCom&sid=00D3h000007R1Lu%21AR0AQMK0XqIiTcFHijiGI.5J303.dtTTgZqyYbnK6iu6_mBrIxFkmFzqShvE6c8FY4ELjJ1Z5cl5_NDV27FylouPaLDmbWKl&skipRedirect=1&lm=eyJlbmMiOiJBMjU2R0NNIiwiYXVkIjoiMDBEM2gwMDAwMDdSMUx1Iiwia2lkIjoie1widFwiOlwiMDBEM2gwMDAwMDdSMUx1XCIsXCJ2XCI6XCIwMkczaDAwMDAwMFFGWE9cIixcImFcIjpcImNvbnRlbnRkb29ydXNlcnRyYW5zaWVudGtleWVuY3J5cHRcIixcInVcIjpcIjAwNTNoMDAwMDAyeFE1c1wifSIsImNyaXQiOlsiaWF0Il0sImlhdCI6MTY4MDE3OTE3NjQ2NiwiZXhwIjowfQ%3D%3D..BEIS8BDm_kfKDL9I.IC5eP6YZO2nhu-WSWP56HA%3D%3D.cadev8_F5qhzIdAzzcv-vQ%3D%3D' \
  -H 'authority: mohansun-ea-02-dev-ed.file.force.com' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H $'cookie: _ce.s=v~521a935acbeb20c80c9fcd40ee0d1e47ceeb29fb~vpv~0; _ga_1HBYZJY0L5=GS1.1.1650657815.1.0.1650657821.0; _ga=GA1.2.731290433.1606657544; sid_Client=h000002xQ5sh000007R1Lu; clientSrc=24.188.37.149; BrowserId_sec=Ga1_6sSXEe26w5WqP0vh9g; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1; BrowserId=Pi75EcoLEe2nss1S-y4GIg; sid=00D3h000007R1Lu\u0021AR0AQPQxwTIi4..zhspyWG5FXJJqqH9TMtpFr2ZkqpQH5WaBlHkivD7aJpjJlD884mCseXoShUalu3IdLjOr7GBNOSxY5I2p; inst=APP_3h' \
  -H 'referer: https://mohansun-ea-02-dev-ed.my.salesforce.com/' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: cross-site' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  --compressed
  ```
```
oid: 00D3h000007R1Lu
retURL: https://mohansun-ea-02-dev-ed.file.force.com/secur/contentDoor?startURL=https%3A%2F%2Fmohansun-ea-02-dev-ed.my.salesforce.com%2Fsetup%2FforcecomHomepage.apexp%3Fsetupid%3DForceCom&sid=00D3h000007R1Lu%21AR0AQIXvv71zFeZY_eRCCFTHPs2.xrl69eBVSmaBJX.wDdf7_Q5gCtWf70K4Ao9VKDmd0k616oMgBIyR2_ISlLBGl1eim57i&skipRedirect=1&lm=eyJlbmMiOiJBMjU2R0NNIiwiYXVkIjoiMDBEM2gwMDAwMDdSMUx1Iiwia2lkIjoie1widFwiOlwiMDBEM2gwMDAwMDdSMUx1XCIsXCJ2XCI6XCIwMkczaDAwMDAwMFFGWE9cIixcImFcIjpcImNvbnRlbnRkb29ydXNlcnRyYW5zaWVudGtleWVuY3J5cHRcIixcInVcIjpcIjAwNTNoMDAwMDAyeFE1c1wifSIsImNyaXQiOlsiaWF0Il0sImlhdCI6MTY4MDE3ODQ4MjAyMywiZXhwIjowfQ%3D%3D..sxLY9IUn87nIGIuv.DylJd7gqisXaz0tZZn66uw%3D%3D.g8WTiSfkUkPNnp7NjManyA%3D%3D
```

```
startURL: https://mohansun-ea-02-dev-ed.my.salesforce.com/setup/forcecomHomepage.apexp?setupid=ForceCom
sid: 00D3h000007R1Lu!AR0AQMK0XqIiTcFHijiGI.5J303.dtTTgZqyYbnK6iu6_mBrIxFkmFzqShvE6c8FY4ELjJ1Z5cl5_NDV27FylouPaLDmbWKl
skipRedirect: 1
lm: eyJlbmMiOiJBMjU2R0NNIiwiYXVkIjoiMDBEM2gwMDAwMDdSMUx1Iiwia2lkIjoie1widFwiOlwiMDBEM2gwMDAwMDdSMUx1XCIsXCJ2XCI6XCIwMkczaDAwMDAwMFFGWE9cIixcImFcIjpcImNvbnRlbnRkb29ydXNlcnRyYW5zaWVudGtleWVuY3J5cHRcIixcInVcIjpcIjAwNTNoMDAwMDAyeFE1c1wifSIsImNyaXQiOlsiaWF0Il0sImlhdCI6MTY4MDE3OTE3NjQ2NiwiZXhwIjowfQ==..BEIS8BDm_kfKDL9I.IC5eP6YZO2nhu-WSWP56HA==.cadev8_F5qhzIdAzzcv-vQ==

```

```
jwt:
eyJlbmMiOiJBMjU2R0NNIiwiYXVkIjoiMDBEM2gwMDAwMDdSMUx1Iiwia2lkIjoie1widFwiOlwiMDBEM2gwMDAwMDdSMUx1XCIsXCJ2XCI6XCIwMkczaDAwMDAwMFFGWE9cIixcImFcIjpcImNvbnRlbnRkb29ydXNlcnRyYW5zaWVudGtleWVuY3J5cHRcIixcInVcIjpcIjAwNTNoMDAwMDAyeFE1c1wifSIsImNyaXQiOlsiaWF0Il0sImlhdCI6MTY4MDE3OTE3NjQ2NiwiZXhwIjowfQ==..BEIS8BDm_kfKDL9I.IC5eP6YZO2nhu-WSWP56HA==.cadev8_F5qhzIdAzzcv-vQ==
```

- header
```json
{
  "enc": "A256GCM",
  "aud": "00D3h000007R1Lu",
  "kid": "{\"t\":\"00D3h000007R1Lu\",\"v\":\"02G3h000000QFXO\",\"a\":\"contentdoorusertransientkeyencrypt\",\"u\":\"0053h000002xQ5s\"}",
  "crit": [
    "iat"
  ],
  "iat": 1680179176466,
  "exp": 0
}

```




|Name|Requirement|Description|
|---|---|---|
|response_type|REQUIRED|```code``` for Authorization Code Grant and ```token``` for Implicit Grant.|
|client_id|	REQUIRED|	The client ID of the client application making the authorization request. A client ID is an opaque number or string issued by a service.|
|redirect_uri|	OPTIONAL|	The URL to which the client application requests the result of the authorization request to be reported. If the client application has registered multiple redirect URIs or has not registered any redirect URI (this is allowed when the client type of the client application is “confidential”), this request parameter is REQUIRED.|
|scope	|OPTIONAL	|A space-delimited list of scopes (permissions) that the client application requires. The service defines a set of valid scope values. Some implementations of OAuth 2.0 (e.g. Facebook) do not correctly implement the specification, requiring a comma-delimited list.|
|state|RECOMMENDED|An opaque value that the client application may use. If this request parameter is contained in the authorization request, it is returned to the redirect URI as a query parameter.|

```py
# Implement your authorization endpoint here
# https://www.authlete.com/developers/definitive_guide/authorization_endpoint_spec/
@app.route('/authorize')
def authorize():
    #...
```
- Implement the token endpoint ```/token```
    - This endpoint handles the **exchange of an authorization code** for an **access token and ID token**
```py
# Implement your token endpoint here
@app.route('/token', methods=['POST'])
def token():
    # ...
```

- Implement the **userinfo** endpoint ```/userinfo```
    - This endpoint returns **information about the authenticated user**
```py
# Implement your userinfo endpoint here
@app.route('/userinfo')
def userinfo():
    # ...
```


-   Implement the logout endpoint 
    - This endpoint handles the **user logout** process
```py
# Implement your logout endpoint here
@app.route('/logout')
def logout():
    # ...
```


##  Code outline

```py

from flask import Flask, redirect, url_for
from flask_oidc import OpenIDConnect

app = Flask(__name__)
app.config.update({
    'SECRET_KEY': 'secret',
    'OIDC_CLIENT_SECRETS': 'client_secrets.json',
    'OIDC_ID_TOKEN_COOKIE_SECURE': False,
    'OIDC_REQUIRE_VERIFIED_EMAIL': False,
    'OIDC_VALID_ISSUERS': 'https://accounts.example.com',
    'OIDC_SCOPES': ['openid', 'email', 'profile'],
})

oidc = OpenIDConnect(app)

@app.route('/')
@oidc.require_login
def index():
    user_info = oidc.user_getinfo(['sub', 'email', 'preferred_username'])
    return 'Hello, {} ({})'.format(user_info['preferred_username'], user_info['email'])

# Implement your authorization endpoint here
@app.route('/authorize')
def authorize():
    # ...

# Implement your token endpoint here
@app.route('/token', methods=['POST'])
def token():
    # ...

# Implement your userinfo endpoint here
@app.route('/userinfo')
def userinfo():
    # ...

# Implement your logout endpoint here
@app.route('/logout')
def logout():
    # ...

if __name__ == '__main__':
    app.run()

```


```
SECRET_KEY: A secret key for Flask to use for its session management.
OIDC_CLIENT_SECRETS: A path to a JSON file containing client secrets for your OIDC provider.
OIDC_ID_TOKEN_COOKIE_SECURE: Whether or not the ID token cookie should be marked as secure.
OIDC_REQUIRE_VERIFIED_EMAIL: Whether or not email verification should be required for OIDC logins.
OIDC_VALID_ISSUERS: A string or list of valid issuer URLs for OIDC logins.
OIDC_SCOPES: A list of scopes to request from the OIDC provider.

```


```js
const { Issuer, Strategy } = require('openid-client');

Issuer.discover('https://accounts.example.com')
  .then((issuer) => {
    const client = new issuer.Client({
      client_id: 'client_id',
      client_secret: 'client_secret',
    });

    const params = {
      redirect_uri: 'https://example.com/callback',
      scope: 'openid email profile',
    };

    const strategy = new Strategy(
      {
        client,
        params,
        passReqToCallback: false,
        usePKCE: 'S256',
      },
      (tokenset, userinfo, done) => {
        // Handle successful authentication here
      }
    );

    // Implement your authorization endpoint here
    app.get('/authorize', (req, res) => {
      // ...
    });

    // Implement your token endpoint here
    app.post('/token', (req, res) => {
      // ...
    });

    // Implement your userinfo endpoint here
    app.get('/userinfo', (req, res) => {
      // ...
    });

    // Implement your logout endpoint here
    app.post('/logout', (req, res) => {
      // ...
    });
  })
  .catch((err) => {
    console.error(err);
  });

```

## References
- [Authorization Server Implementation for Deno](https://deno.land/x/authlete_deno_fen_oauth_server@v1.0.0)
- [An Illustrated Guide to OAuth and OpenID Connect](https://developer.okta.com/blog/2019/10/21/illustrated-guide-to-oauth-and-oidc)
- [Configure an Authentication Provider Using OpenID Connect](https://help.salesforce.com/s/articleView?id=sf.sso_provider_openid_connect.htm&type=5)
- [RegistrationHandler Interface](https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_auth_plugin.htm)

    
