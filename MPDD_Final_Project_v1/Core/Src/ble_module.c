//
//
//void SendATCommand(const char *cmd)
//{
//    char buffer[100];  // Buffer to hold the complete AT command
//    snprintf(buffer, sizeof(buffer), "%s", cmd); // Append CR and NL to the command
//    HAL_UART_Transmit(&huart6, (uint8_t*)buffer, strlen(buffer), HAL_MAX_DELAY);
//}
