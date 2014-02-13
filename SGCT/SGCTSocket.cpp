#include "SGCTSocket.h"
#include "worm.h"
#include "serializing.h"
#include <stdlib.h>
#include <time.h>


SGCTSocket::SGCTSocket(int port, char* adress, socketType type)
{
	mPort = port;
	mAdress = adress;
	mType = type;
}

SGCTSocket::~SGCTSocket()
{
	CloseConnection();
}

const bool SGCTSocket::InitWSA()
{
	//initialize WSA
	WSADATA wsaData;
	int errorStatus = WSAStartup(0x0202, &wsaData);
	if (errorStatus)
	{
		return false;
	}

	if(wsaData.wVersion != 0x0202)
	{
		WSACleanup();
		return false;
	}
	return true;
}

bool SGCTSocket::CreateConnection()
{
	SOCKADDR_IN info;
	info.sin_family = AF_INET;
	info.sin_port = htons(mPort);
	info.sin_addr.S_un.S_addr = inet_addr(mAdress);
	if(mType == kTCP)
	{
		mSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	}
	else
	{
		mSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_UDP);
	}

	if(mSocket == INVALID_SOCKET)
	{
		return false;
	}
	if(connect(mSocket, (SOCKADDR*)&info, sizeof(info)) == SOCKET_ERROR)
	{
		return false;
	}
	else
	{
		return true;
	}
}

void SGCTSocket::CloseConnection()
{
	if(mSocket)
	{
		closesocket(mSocket);
	}
}
void SGCTSocket::SendData()
{
	srand(time(NULL));
	//Send wormdeaths and WormData.
	wormData data;

	data.direction = rand();
	data.id = rand();

	send(mSocket,(char const*)&data,sizeof(wormData),0);

}

void SGCTSocket::GetData()
{
	if(!mSocket)
	{
		return;
	}
	if(kTCP)
	{
		//worm registrations
		char* buff = new char[1024];
		if(buff == "")
		{
			return;
		}
	}
	else
	{
		//worm movement
	}
}