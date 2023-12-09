#include "ili9163.h"
#include "string.h"
#include <stdint.h>
#include "main.h"


char writeString[50] = "";
extern flag;
int counter = 0;
int pos = 5;
void updateScreen(char* writeString) {
		ILI9163_newFrame();
		ILI9163_drawStringF(5, 10, Font_7x10, BLACK, writeString);
		ILI9163_render();
	}

void key_pad(char keyChar){
	switch(keyChar) {
				case 'A':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "A");
						updateScreen(writeString);
						counter ++;

					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "B");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "C");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'D':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "D");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "E");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "F");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'G':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "G");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "H");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "I");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'J':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "J");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "K");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "L");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'M':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "M");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "N");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "O");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'P':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "P");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "Q");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "R");
						updateScreen(writeString);
						counter ++;
					}
					else if(counter == 3){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "S");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'T':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "T");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "U");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "V");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case 'W':
					if(counter == 0){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "W");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 1){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "X");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 2){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "Y");
						updateScreen(writeString);
						counter ++;
					}

					else if(counter == 3){
						if(strlen(writeString) > 0) {
							writeString[strlen(writeString) - 1] = '\0';
							updateScreen(writeString);
						}
						strcat(writeString, "Z");
						updateScreen(writeString);
						counter = 0;
					}
					keyChar = 0;
					break;

				case '#':
					strcat(writeString, " ");
					writeString[strlen(writeString) + 1] = '\0';
					updateScreen(writeString);
					counter = 0;
					keyChar = 0;
					pos += 10;
					break;

				case 'B':
					if(strlen(writeString) > 0) {
						writeString[strlen(writeString) - 1] = '\0';
						updateScreen(writeString);
						strcat(writeString, "");
						updateScreen(writeString);
					}
					counter = 0;
					keyChar = 0;
					break;

				case 'C':
					writeString[0] = '\0';
					updateScreen(writeString);
					counter = 0;
					keyChar = 0;
					break;

				case '*':
					flag = 1;
					keyChar = 0;
					break;
				case 'd':

					if (flag == 2){
						flag = 0;
						keyChar = 0;
						break;
					}
					else{
						flag = 2;
						writeString[0] = 'Now Transmitting Gyroscope Data...';
						updateScreen(writeString);
						keyChar = 0;
						break;
					}

	}
}
