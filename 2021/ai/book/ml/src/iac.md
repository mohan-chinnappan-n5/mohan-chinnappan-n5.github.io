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

- remembers the state of the already provisioned resources - [Idempotence](https://en.wikipedia.org/wiki/Idempotence) - certain operations can be applied **multiple times** without changing the result beyond the initial application.


<video controls loop=""><source src="https://www.terraform.io/videos/oss-cli-demo.mp4" type="video/mp4"></video>






## Videos

<iframe width="560" height="315" src="https://www.youtube.com/embed/Tkv49sTvKZY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
