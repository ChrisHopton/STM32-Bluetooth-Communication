#pragma once

#define TRANSPARENT	0

#define BGR(b, g, r) (((b & 0b11111000)<<8) + ((r & 0b11111100)<<3)+(g>>3))

#define GRAY      BGR(127, 127, 127)
#define DARKGRAY  BGR(64, 64, 64)
#define LIGHTGRAY BGR(220, 220, 220)

#define BLUE	  BGR(255,0,0)
#define GREEN     BGR(0, 100, 0)
#define RED       BGR(0, 0, 255)

#define ORANGE    BGR(255,140,0)
#define BLACK 	  BGR(0,0,0)
#define WHITE	  BGR(255,255,255)
