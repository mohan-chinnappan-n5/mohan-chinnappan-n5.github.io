package main

// go get -u "github.com/xwb1989/sqlparser
import (
	"fmt"

	"github.com/xwb1989/sqlparser"
)

func main() {
	sql := "SELECT * FROM table"
	fmt.Printf("Sql %v\n", sql)
	stmt, err := sqlparser.Parse(sql)
	if err != nil {
		// Do something with the err
		fmt.Printf("Error %v\n", err)
	}

	// Otherwise do something with stmt
	switch stmt := stmt.(type) {
	case *sqlparser.Select:
		_ = stmt
		fmt.Printf("%v", stmt)

	case *sqlparser.Insert:
	}
}
