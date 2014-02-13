#include <stdlib.h>
#include <stdio.h>

#include "sgct.h"
#include "SGCTSocket.h"
#include "worm.h"

sgct::Engine * gEngine;
SGCTSocket* wormRegisterSocket;

void PreSyncFunction();
void PostSyncFunction();

int main( int argc, char* argv[] )
{
	gEngine = new sgct::Engine( argc, argv );
	gEngine->setPreSyncFunction(PreSyncFunction);
	gEngine->setPostSyncPreDrawFunction(PostSyncFunction);
	if( !gEngine->init() )
	{
		delete gEngine;
		return EXIT_FAILURE;
	}
	//test if winsock can be initated
	if(SGCTSocket::InitWSA())
	{
		sgct::MessageHandler::Instance()->print("OK to open socket!");
		wormRegisterSocket = new SGCTSocket(1338, "127.0.0.1", socketType::kTCP);
	}
	wormRegisterSocket->CreateConnection();
	gEngine->render();
 
	// Clean up
	delete gEngine;
	delete wormRegisterSocket;
	WSACleanup();
	
	// Exit program
	exit( EXIT_SUCCESS );
}

void PreSyncFunction()
{
	wormRegisterSocket->GetData();
}

void PostSyncFunction()
{
	wormRegisterSocket->SendData();
}