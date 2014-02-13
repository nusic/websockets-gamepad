#ifndef __SERIALIZING_H__
#define __SERIALIZING_H__


char * serialize_int(char* buffer, int value)
{
	buffer[0] = value >> 24;
	buffer[1] = value >> 16;
	buffer[2] = value >> 8;
	buffer[3] = value;

	return buffer+4;
}

#endif