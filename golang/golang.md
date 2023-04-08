# Install Golang


# Create Project
```

mkdir codegen
cd codegen
touch main.go
go mod init codegen
go: creating new go.mod: module codegen
go: to add module requirements and sums:
        go mod tidy

```

```
go mod tidy
```

- go.mod content looks lik this

```
module codegen

go 1.17

```

```
cat main.go
```

```go
package main

// Print comes from "fmt" package
import "fmt"

func main() {
	fmt.Println("Hello from Golang!")
}
```

- run go program

```
go run main.go

```

```
Hello from Golang!

```

# Development

- using a variable and constant

```go
package main

// Print comes from "fmt" package
import "fmt"

func main() {

	var greeting = "Welcome from Golang for codegen"
	const appName = "codegen"

	const totalSections = 6
	var sectionsCreated = totalSections

	fmt.Println(greeting, "for", appName, "!")

	fmt.Println("total sections:", totalSections, "\nsections created:", sectionsCreated)

	fmt.Printf("Welcome to %v today!\n", appName)

	var sectionName string
	fmt.Println("Memory location of", "sectionName", &sectionName)
	// ask for use input
	fmt.Println("Enter section name:")
	fmt.Scan(&sectionName)

	fmt.Printf("Section Name: %v\n", sectionName)

	// %T provides the type of the variable or const
	fmt.Printf("Section Name: %T\n", sectionName)

}


```


## Using Array

```
func getFruits() {
	var fruits []string
	fruits = append(fruits, "Apple")
	fruits = append(fruits, "Mango")
	fmt.Printf("Fruits list %v\n", fruits)
}

```

## Using Map

```go
func getRecord() {

	var record = make(map[string]string)
	record["apple"] = "yellow delicious"
	record["mango"] = "salem"

	fmt.Printf("Fruits %v\n", record)
}

```


# Creation

```
sfdx mohanc:slides:gen -i golang.md -o golang.md.html -t 'Golang'
```

