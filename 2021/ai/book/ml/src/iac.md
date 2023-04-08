# Infrastructure as code

## Benefits
- Repeatable
- Infrastructure automation
- Integration with CI/CD
- Git integration (GitOps)
- Visibility and auditing 
    - Doc source of the infrastructure 


### Imperative way

```python

def setup(env_name):
    setupEC2Instance(env_name)
    buckets = ['one', 'two', 'three']
    for bucket in buckets:
        setupEC2Bucket(env_name, bucket)


```
- lot of work!


### Declarative

- GCP - [Deployment Manager](https://cloud.google.com/deployment-manager/docs)
- AWS - [AWS CloudFormation](https://aws.amazon.com/cloudformation/)
- Azure - [Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview)

- For multi-cloud [Terraform](https://www.terraform.io/) 
    - infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services.
    - Open source
    - Uses a language hcl [HashiCorp Config Language](https://www.terraform.io/language/syntax/configuration)

```java

resource "aws_instance" "example" {
  ami = "data.aws_ami.redhat.id"
  instance_type = "t3.micro"

  network_interface {
    # ...
  }
}


```

- remembers the state of the already provisioned resources - [Idempotence](https://en.wikipedia.org/wiki/
Idempotence) - certain operations can be applied **multiple times** without changing the result beyond the initial application.


### Installing Terraform CLI
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

```

- Usage
```
% terraform
Usage: terraform [global options] <subcommand> [args]

The available commands for execution are listed below.
The primary workflow commands are given first, followed by
less common or more advanced commands.

Main commands:
  init          Prepare your working directory for other commands
  validate      Check whether the configuration is valid
  plan          Show changes required by the current configuration
  apply         Create or update infrastructure
  destroy       Destroy previously-created infrastructure

All other commands:
  console       Try Terraform expressions at an interactive command prompt
  fmt           Reformat your configuration in the standard style
  force-unlock  Release a stuck lock on the current workspace
  get           Install or upgrade remote Terraform modules
  graph         Generate a Graphviz graph of the steps in an operation
  import        Associate existing infrastructure with a Terraform resource
  login         Obtain and save credentials for a remote host
  logout        Remove locally-stored credentials for a remote host
  output        Show output values from your root module
  providers     Show the providers required for this configuration
  refresh       Update the state to match remote systems
  show          Show the current state or a saved plan
  state         Advanced state management
  taint         Mark a resource instance as not fully functional
  test          Experimental support for module integration testing
  untaint       Remove the 'tainted' state from a resource instance
  version       Show the current Terraform version
  workspace     Workspace management

Global options (use these before the subcommand, if any):
  -chdir=DIR    Switch to a different working directory before executing the
                given subcommand.
  -help         Show this help output, or the help for a specified subcommand.
  -version      An alias for the "version" subcommand.

```


- Demo
<video controls loop=""><source src="https://www.terraform.io/videos/oss-cli-demo.mp4" type="video/mp4"></video>






## Videos

<iframe width="800" height="420" src="https://www.youtube.com/embed/Tkv49sTvKZY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
