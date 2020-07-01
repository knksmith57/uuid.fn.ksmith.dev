# `uuid.fn.ksmith.dev`

> generate and convert v1 and v4 UUIDs between base32, canonical, and hex representations

## deploy

```sh
❯ docker build -t knksmith57/uuid.fn.ksmith.dev .

❯ docker push knksmith57/uuid.fn.ksmith.dev

❯ kubectl apply -f service.yaml
```

## usage

### routes

##### request options

###### `format`

Encoding format: `base32`, `canonical` (default), and `hex`

#### `/v1`

Generate a new v1 UUID

```sh
❯ curl uuid.fn.ksmith.dev/v1
42b85690-bb7b-11ea-b44b-3db8c69d3f44

❯ curl uuid.fn.ksmith.dev/v1?format=base32
IK4FNEF3PMI6VNCLHW4MNHJ7IQ

❯ curl uuid.fn.ksmith.dev/v1?format=canonical
42b85690-bb7b-11ea-b44b-3db8c69d3f44

❯ curl uuid.fn.ksmith.dev/v1?format=hex
42b85690bb7b11eab44b3db8c69d3f44
```

#### `/v4` (alias: `/`)

Generate a new v4 UUID

```sh
❯ curl uuid.fn.ksmith.dev/v4
c1236338-ebcc-4f97-96e2-57527834e8e2

❯ curl uuid.fn.ksmith.dev/v4?format=base32
YERWGOHLZRHZPFXCK5JHQNHI4I

❯ curl uuid.fn.ksmith.dev/v4?format=canonical
c1236338-ebcc-4f97-96e2-57527834e8e2

❯ curl uuid.fn.ksmith.dev/v4?format=hex
c1236338ebcc4f9796e257527834e8e2
```

#### `/convert`

Convert a provided UUID to the specified encoding (or `base32` if empty)

```sh
❯ curl uuid.fn.ksmith.dev/convert?uuid=46KMPR24YZG7BAT65KYCOYXK5I&format=canonical
e794c7c7-5cc6-4df0-827e-eab02762eaea

❯ curl uuid.fn.ksmith.dev/convert -Gd uuid=e794c7c7-5cc6-4df0-827e-eab02762eaea -d format=hex
e794c7c75cc64df0827eeab02762eaea

❯ curl uuid.fn.ksmith.dev/convert -Gd uuid=e794c7c75cc64df0827eeab02762eaea -d format=base32
46KMPR24YZG7BAT65KYCOYXK5I
```
