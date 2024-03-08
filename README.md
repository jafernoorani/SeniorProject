# SeniorProject


Welcome to SugarDaddy!


## EC2 Webserver Deployment
Create an AWS account & create you access keys

1. Configure your AWS CLI

```python
$ aws configure
AWS Access Key ID [None]: <your_access_key>
AWS Secret Access Key [None]: <your_secret_key>
Default region name [None]: us-east-1
Default output format [None]: json
```

2. Create your AWS keypair
```python
$ aws ec2 create-key-pair --key-name <your_key_pair_name>
$ chmod 400 <your_key_pair_file>
```

3. Create your security group
```
```

5. Create an instance
```python
$  aws ec2 run-instances --image-id "ami-07761f3ae34c4478d" --instance-type "t2.micro" --key-name "testKey" --security-groups "WebServerGroup" --region "us-east-1"
{ JSON OUTPUT WITH INSTANCE DETAILS }
```

6. Check your instances is being created
```python
$ aws ec2 describe-instances
{ JSON OUTPUT WITH ALL INSTANCES DETAILS }
```
_Note: You will need to wait for a little bit before your instance is assigned a Public IP Address_

7. Connect to your instance
```python
$ ssh -i <your_key_pair_file> ec2@<your_instance_public_ip>
[ SHELL SESSION TO YOUR INSTANCE ]
```

8. Install a basic webserver
```python
$ sudo su
$yum update -y
$yum install -y httpd
$systemctl start httpd.service
$systemctl enable httpd.service
$echo “Hello, my name is $(hostname -f)” > /var/www/html/index.html
$curl $(curl http://checkip.amazonaws.com)
```

9. Install git and clone this repo
```python
$yum install -y git
$git clone https://github.com/jafernoorani/SeniorProject.git
$cp <web_files> /var/www/html
```
_Note: (DO NOT COPY PAST, else → fatal: protocol ‘https’ is not supported)_
