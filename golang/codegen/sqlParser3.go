package main

// go get github.com/marianogappa/sqlparser
import (
	"fmt"
	"log"

	"github.com/marianogappa/sqlparser"
)

func main() {
	query, err := sqlparser.Parse("SELECT a, b, c FROM 'd' WHERE e = '1' AND f > '2'")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+#v", query)
}
