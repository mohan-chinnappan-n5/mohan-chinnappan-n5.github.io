# REST Tester

- HTML markup is server-side-rendered in this app

<iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="1200"
    height="600"
    src="https://mohanc-rest.deno.dev">
</iframe>

## URLs
- [https://mohanc-rest.deno.dev](https://mohanc-rest.deno.dev)
- [https://mohanc-rest.deno.dev/users/1](https://mohanc-rest.deno.dev/users/1)
- [https://mohanc-rest.deno.dev/users/2](https://mohanc-rest.deno.dev/users/2)

## Verbs
- [GET](#get)
- [POST](#post)
- [PUT](#put)
- [DELETE](#delete)

## GET
<a name='get'></a>

### Date
```
curl -X GET https://mohanc-rest.deno.dev/date | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    35  100    35    0     0    208      0 --:--:-- --:--:-- --:--:--   207
```

```json
{
  "date": "2023-02-06T00:36:12.687Z"
}

```
### GET a particular user

```
curl -X GET https://mohanc-rest.deno.dev/users/1 | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    36  100    36    0     0    238      0 --:--:-- --:--:-- --:--:--   238
```

```json
{
  "id": "1",
  "username": "Ken Thompson"
}

```


## POST
<a name='post'></a>
```
curl -X POST https://mohanc-rest.deno.dev/users/1000 -d '{"text":"Awesome user!"}' | jq  
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   117  100    93  100    24    352     90 --:--:-- --:--:-- --:--:--   443
```

```json
{
  "msg": "Received a POST HTTP method for user of id: 1000",
  "payload": {
    "text": "Awesome user!"
  }
}
```


## PUT
<a name='put'></a>

```
curl -X PUT  https://mohanc-rest.deno.dev/users/1 | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    54  100    54    0     0    308      0 --:--:-- --:--:-- --:--:--   308
```

```json
{
  "msg": "Received a PUT HTTP method for user of id: 1"
}
```

## DELETE
<a name='delete'></a>

```
curl -X DELETE  https://mohanc-rest.deno.dev/users/1 | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    57  100    57    0     0    370      0 --:--:-- --:--:-- --:--:--   367
```
```json
{
  "msg": "Received a DELETE HTTP method for user of id: 1"
}
```






