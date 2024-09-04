"use client"
import {ClientLottie} from '@/app/ClientLottie';
import {ChangeEventHandler, useState} from 'react';


export default function Page() {
	const [data, setData] = useState<File>()



	return (
		<ClientLottie data={data}/>
	)
}
