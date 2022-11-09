# One-Wire Interface

## Setup

Setup config files for each supported type are placed in the **./setup** directory.

## Config

config/w1.json
```
{
  "type": "raspberry-gpio",
  "gpio": 4,
  "path": "/sys/bus/w1/devices"
}
```

## DS18B20 1-Wire Digital Thermometer

The [DS18B20](http://www.maximintegrated.com/datasheet/index.mvp/id/2812) 1-Wire Digital Thermometer converts temperature to 12-Bit digital word in 750ms (Max). So this is the Max read rate.
