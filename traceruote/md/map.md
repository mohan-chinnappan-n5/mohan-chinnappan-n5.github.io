# Map

- Uses api-key from [IPInfo](https://ipinfo.io/)

## Usage

```
chart3.py [-h] --input-csv INPUT_CSV --api-key API_KEY

Plot traceroute hops on a world map.

options:
  -h, --help            show this help message and exit
  --input-csv INPUT_CSV
                        Path to the traceroute CSV file
  --api-key API_KEY     API key for IPinfo service


```

## Demo

```
python3 chart3.py --input-csv ~/Documents/lex1.csv --api-key IPinfo_api_key
Map saved to /Users/xyz/Documents/lex1_map.html

```

![tr map](img/tr_map.png)