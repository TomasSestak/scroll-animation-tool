"use client"
import {ClientLottie} from '@/app/ClientLottie';
import {ChangeEventHandler, useState} from 'react';


export default function Page() {
	const [data, setData] = useState<File>()

	const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.target.files![0];
		if (file && file.type === 'application/json') {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const json = JSON.parse(e.target!.result! as any);
					setData(json)
				} catch (error) {
					console.error('Error parsing JSON file:', error);
				}
			};
			reader.readAsText(file);
		} else {
			console.error('Please upload a valid JSON file.');
		}
	}

	if (!data) {
		return <input type="file" onChange={onChange}/>
	}


	return (
		<ClientLottie data={data}/>
	)
}
