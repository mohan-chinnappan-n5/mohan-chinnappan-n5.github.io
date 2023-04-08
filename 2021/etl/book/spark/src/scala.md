# Scala

```scala
Loading...
Welcome to the Ammonite Repl 2.5.0 (Scala 2.13.7 Java 11.0.9)
@ java.lang.Integer.MAX_VALUE 
res0: Int = 2147483647

@ java.lang.Integer.M 
MAX_VALUE  MIN_VALUE
@ java.lang.Integer.MI 
MIN_VALUE
@ java.lang.Integer.MIN_VALUE 
res1: Int = -2147483648

@ var y = 100 
y: Int = 100

@ y = 200 


@ val c = 9 
c: Int = 9

@ c = 20 
cmd5.sc:1: reassignment to val
val res5 = c = 20
             ^
Compilation Failed

@ var s = "hello" 
s: String = "hello"

@ var t: String = "Apple" 
t: String = "Apple"

@ println(t) 
Apple


@ val rec=  ("apple", 100, "nh") 
rec: (String, Int, String) = ("apple", 100, "nh")

@ rec._2 
res9: Int = 100

@ rec._1 
res10: String = "apple"

@ rec._2 
res11: Int = 100

@ rec._3 
res12: String = "nh"


@ val fruits = Array[String]("apple", "mango") 
fruits: Array[String] = Array("apple", "mango")

@ fruits[0] 
cmd14.sc:1: value fruits of type Array[String] does not take type parameters.
val res14 = fruits[0]
                  ^
Compilation Failed

@ fruits(1) 
res14: String = "mango"

@ fruits(0) 
res15: String = "apple"

@ def hello(title: String, firstName: String, lastNameOpt: Option[String]) = {
      lastNameOpt match {
        case Some(lastName) => println(s"Hello $title. $lastName")
        case None => println(s"Hello $firstName")
      }
    } 
defined function hello

@ hello("mr", "mohan") 
cmd17.sc:1: not enough arguments for method hello: (title: String, firstName: String, lastNameOpt: Option[String]): Unit.
Unspecified value parameter lastNameOpt.
val res17 = hello("mr", "mohan")
                 ^
Compilation Failed

@ hello("mr", "mohan", None) 
Hello mohan


@ hello("mr", "mohan", "Chinnappan") 
cmd18.sc:1: type mismatch;
 found   : String("Chinnappan")
 required: Option[String]
val res18 = hello("mr", "mohan", "Chinnappan")
                                 ^
Compilation Failed

@ hello("mr", "mohan", "Chinnappan") 
cmd18.sc:1: type mismatch;
 found   : String("Chinnappan")
 required: Option[String]
val res18 = hello("mr", "mohan", "Chinnappan")
                                 ^
Compilation Failed

@ hello("mr", "mohan", Some("Chinnappan")) 
Hello mr. Chinnappan


```

## Loops

```scala
@ var total = 0 
total: Int = 0

@  for (i <- Range(0, 5)) {
      println("Looping " + i)
      total = total + i
    } 
Looping 0
Looping 1
Looping 2
Looping 3
Looping 4
```


```scala
@ var sum = 0 
sum: Int = 0

@ var qtys = Array(10,20,30) 
qtys: Array[Int] = Array(10, 20, 30)

@ for (qty <- qtys) sum += qty 


@ sum 
res24: Int = 60
```

```scala
val multi = Array(Array(1, 2, 3), Array(4, 5, 6))

for (arr <- multi; i <- arr) println(i)


1
2
3
4
5
6
```


## Yield

```scala
@ val a = Array(1, 2, 3, 4) 
a: Array[Int] = Array(1, 2, 3, 4)

@ val a2 = for (i <- a) yield i*i 
a2: Array[Int] = Array(1, 4, 9, 16)

```

```scala
@ val a = Array(1, 2); val b = Array("hello", "world") 
a: Array[Int] = Array(1, 2)
b: Array[String] = Array("hello", "world")

@ val flattened = for (i <- a; s <- b) yield s + i 
flattened: Array[String] = Array("hello1", "world1", "hello2", "world2")


```


## Methods and Functions

```scala

@ def printHello(times: Int) = {
      println("hello " + times)
    } 
defined function printHello


@ printHello(10) 
hello 10

```

### Method returning values

```scala
@ def hello(i: Int = 0) = {
      "hello " + i
    } 
defined function hello

@ hello(5) 
res34: String = "hello 5"

```

### Function Values
Functions values are similar to methods, in that you call them with arguments and they can perform some action or return some value. 

Unlike methods, functions themselves are values: you can pass them around, store them in variables, and call them later.

```scala
@ var g: Int => Int = i => i + 1 
g: Int => Int = ammonite.$sess.cmd35$$$Lambda$2056/0x00000008009d7040@7f14bdd1

@ g(10) 
res36: Int = 11

@ g = i => i * 2 


@ g(10) 
res38: Int = 20

```

## Method taking Function Value as argument
    - higher order methods

```scala
  class Box(var x: Int) {
      def update(f: Int => Int) = x = f(x)
      def printMsg(msg: String) = {
        println(msg + x)
      }
    } 
defined class Box

@ val b = new Box(10) 
b: Box = ammonite.$sess.cmd39$Box@54516707

@ b.p 
printMsg
@ b.printMsg("Awesome") 
Awesome10


@ b.up 
update
@ b.update(y => y*100) 


@ b.printMsg("Awesome") 
Awesome1000

```
```
@  b.update(_ + 5) 

@ b.printMsg("Great") 
Great1005
 ```

 ### Method with Multiple Parameter Lists

 ```scala
 @ def myLoop(start: Int, end: Int) (callback: Int => Unit) = {
  for (i <- Range(start, end)) {
  callback(i)
  }
  } 
defined function myLoop

 myLoop(start = 5, end = 10) { 
     i => println(s"i has value ${i}")
  } 
i has value 5
i has value 6
i has value 7
i has value 8
i has value 9



```

## Classes and Traits

You can define classes using the class keyword, and instantiate them using new.

```
@  class Foo(x: Int) {
      def printMsg(msg: String) = {
        println(msg + x)
      }
    } 
defined class Foo

@ val f = Fo 
Foo
@ val f = Foo(10) 
cmd49.sc:1: not found: value Foo
val f = Foo(10)
        ^
Compilation Failed

@ val f = new Foo(10) 
f: Foo = ammonite.$sess.cmd48$Foo@5223eb62

 
@ f.printMsg("foo") 
foo10

// PRIVATE
@ f.x 
cmd51.sc:1: value x is not a member of ammonite.$sess.cmd48.Foo
val res51 = f.x
              ^
Compilation Failed

```

- To make x publicly accessible you can make it a val, and to make it mutable you can make it a var:



```
 @  class Bar(val x: Int) {
      def printMsg(msg: String) = {
        println(msg + x)
      }
    } 
defined class Bar

 
@ val b = new Bar(20) 
b: Bar = ammonite.$sess.cmd51$Bar@69b242f9

 
@ b.printMsg("bar") 
bar20


@ b.x 
res54: Int = 20


```


```
@  class Qux(var x: Int) {
      def printMsg(msg: String) = {
        x += 1
        println(msg + x)
      }
    } 
defined class Qux

@ var q = new Qux(100) 
q: Qux = ammonite.$sess.cmd55$Qux@139b9795

@ q.x 
res57: Int = 100

@ q.printMsg("Qux") 
Qux101



```


```
@ var z = new Baz(12) 
z: Baz = ammonite.$sess.cmd59$Baz@3dc666ab
 
            
Compilation Failed

@ z.printMsg("Baz") 
Baz!!!!!!!!!!!!


```


## Traits

traits are similar to **interfaces** in traditional object-oriented languages: a set of methods that multiple classes can inherit. 

- Instances of these classes (which extends the trait) can then be used interchangeably.

```scala

@ trait Point{ def hypotenuse: Double } 
defined trait Point

@ class Point2D(x: Double, y: Double) extends Point{
      def hypotenuse = math.sqrt(x * x + y * y)
    } 
defined class Point2D

@ class Point3D(x: Double, y: Double, z: Double) extends Point{
      def hypotenuse = math.sqrt(x * x + y * y + z * z)
    } 
defined class Point3D

@ val points: Array[Point] = Array(new Point2D(1, 2), new Point3D(4, 5, 6)) 
points: Array[Point] = Array(ammonite.$sess.cmd63$Point2D@2a336787, ammonite.$sess.cmd64$Point3D@22b51ab4)

@ for (p <- points) println(p.hypotenuse) 
2.23606797749979
8.774964387392123


```
## Collections

```scala
@ def stdDev(a: Array[Double]): Double = {
      val mean = a.sum / a.length
      val squareErrors = a.map(x => x - mean).map(x => x * x)
      math.sqrt(squareErrors.sum / a.length)
    } 
defined function stdDev

@ val input = new Array(10,20,30,40,11,44) 
cmd68.sc:1: too many arguments (found 6, expected 1) for constructor Array: (_length: Int): Array[T]
val input = new Array(10,20,30,40,11,44)
                         ^
Compilation Failed

@ val input = Array(10,20,30,40,11,44) 
input: Array[Int] = Array(10, 20, 30, 40, 11, 44)

@ stdD 
stdDev
@ stdDev(input) 
cmd69.sc:1: type mismatch;
 found   : Array[Int]
 required: Array[Double]
val res69 = stdDev(input)
                   ^
Compilation Failed

@ val input2 = Array(10.0,20.0,30.0,40.0,11.0,44.0) 
input2: Array[Double] = Array(10.0, 20.0, 30.0, 40.0, 11.0, 44.0)

@ stdDev(input2) 
res70: Double = 13.246592853342412

// FUN

@ input.map(x => x*x) 
res71: Array[Int] = Array(100, 400, 900, 1600, 121, 1936)

@ input.map(x => x*x).map(x => x-2) 
res72: Array[Int] = Array(98, 398, 898, 1598, 119, 1934)


```


