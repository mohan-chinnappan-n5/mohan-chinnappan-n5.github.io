# JWT (JSON Web Tokens)


```mermaid
sequenceDiagram
title: JWT - JSON Web Token - GoogleOIDC

    User->>SFDC: I need to login into the Org 
    SFDC->>User: OK, can you prove your identity, I will send you to Google OIDC,<br/> Since that is configured as your authProvider
    User->>GoogleOIDC:  Login
    GoogleOIDC->>SFDC: Here is the ID proof of the User, JWT    
    SFDC->>User: You are logged-in, go ahead and use the Org 
    User->>SFDC: Performs work in the Org: Authorization: Bearer JWT

```

## Parts of JWT

**Header.Payload.Signature**

|Part|Description|
|---|---|
|**Header**|```{typ: "JWT", alg: "HS256"}```|
|**Payload**||
|> Registered Claims|```{exp: 1679913812248, sub: "Subject here"}```|
|> Public Claims| ```{name: "Ken Thompson"}```|
|> Private Claim|```{admin: true}```|
|**Signature**|``` HMACSHA256( base64URLencode( Header+Payload, secret )``` |


### Signature

```js
  const signature =  HMACSHA256( base64URLencode( Header+Payload, secret );
  
``` 
- **Verification**:
Server calculates the signature based on the data present in the token (JWT) and compares with the signature that came in the token. If a malicious user tampers anything in the header or payload, the server’s calculated signature won’t match the received signature.


### Code

- jwt util module (jwt.ts)

```ts
// jwt.ts

// Exports:
//  createJWT 
//  verifyJWT

import { encode, decode } from "https://deno.land/std/encoding/base64url.ts";
import { Sha256 } from "https://deno.land/std@0.90.0/hash/sha256.ts";

// create JWT
export function createJWT(header: any, payload: any, secret: string): string {
  const eHeader = encode(new TextEncoder().encode(JSON.stringify(header)));
  const ePayload = encode(new TextEncoder().encode(JSON.stringify(payload)));
  const token = `${eHeader}.${ePayload}`;
  // hash functions process input of any length and produces a fixed-size hash.
  return token + "." + new Sha256(secret).update(token).toString();
}



// verification
export function verifyJWT(token: string, secret: string): any {
  // get the parts
  const parts = token.split(".");
  if (parts.length !== 3) return "not enought items"; // not enough items
  const [header, payload, signature] = parts;

  const calcSign = new Sha256(secret).update(`${header}.${payload}`).toString();
  if (calcSign !== signature) return "invalid signature"; // invalid signature

  const payloadOut = JSON.parse(new TextDecoder().decode(decode(payload)));
  if (payloadOut.exp && Date.now() > payloadOut.exp) return `EXPIRED:${JSON.stringify(payloadOut)}`; // expired

  return payloadOut;
}


```

- using jwt.ts
```js


// jwtApp.ts

// uses jwt.ts in the local
// run:
// . deno run jwtApp.ts

import {createJWT, verifyJWT} from './jwt.ts';


const secret = "mySecret";
const jwt1 = createJWT(
  { typ: "JWT", alg: "HS256" },
  { exp: 1679913812248, sub: "SUB1", name: "Ken Thompson", admin: true },
  secret
);
console.log('JWT:', jwt1);

console.log('Verification:', verifyJWT(jwt1, secret));




```

- Testing
```bash

deno run jwtApp.ts

JWT: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Nzk5MTM4MTIyNDgsInN1YiI6IlNVQjEiLCJuYW1lIjoiS2VuIFRob21wc29uIiwiYWRtaW4iOnRydWV9.5eaeb498ad001a7a17ce1816d5dea56a6fa6c11438ce4aa93361224f
Verification: EXPIRED:{"exp":1679913812248,"sub":"SUB1","name":"Ken Thompson","admin":true}


```

- Testing at [jwt.io](https://jwt.io/)

![jwt checking](img/jwt-check-1.png)


### Using CLI

- Create
```
cat payload.json 
```

```json
 { "exp": 1679913812248, "sub": "SUB1", "name": "Ken Thompson", "admin": true }
```

```

sfdx mohanc:security:jwt:create -i payload.json -s "mySecret"


```

```

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzk5MTM4MTIyNDgsInN1YiI6IlNVQjEiLCJuYW1lIjoiS2VuIFRob21wc29uIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3OTkxNzc0OX0.B0KltHsNOUBlPjA8YEdpXKY24ZsGpJI67GBzOW-jMr8

```
---

- Verify
```

sfdx mohanc:security:jwt:verify -s "mySecret" -j "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzk5MTM4MTIyNDgsInN1YiI6IlNVQjEiLCJuYW1lIjoiS2VuIFRob21wc29uIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3OTkxODQ3NX0.KvYu4MvjmTsX3gfEow7eAHY7PspDV465RCb4tkIme2Y"

```

```json
{
  exp: 1679913812248,
  sub: 'SUB1',
  name: 'Ken Thompson',
  admin: true,
  iat: 1679918475
}

```


