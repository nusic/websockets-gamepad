#pragma once
#include <winsock.h>
typedef enum eSocketType
{
		kUDP = 0,
		kTCP,
} socketType;
class SGCTSocket
{
public:
	SGCTSocket(int port, char* adress, socketType type);
	~SGCTSocket();
	const static bool InitWSA();

	bool CreateConnection();
	void CloseConnection();

	void SendData();
	void GetData();
	
private:
	SOCKET mSocket;
	socketType mType;
	int mPort;
	char* mAdress;
};