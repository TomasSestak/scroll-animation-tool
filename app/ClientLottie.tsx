'use client'
import {ChangeEventHandler, useRef, useState} from 'react';
import type {AnimationItem} from 'lottie-web';
import {useLocalStorage} from 'usehooks-ts';
import {ScrollToolConfig} from '@/scroll-tool-config';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import Lottie from 'react-lottie-player';

import {JsonEditor} from 'json-edit-react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ClientLottie = ({data}: { data: any }) => {

	const [lottieData, setLottieData] = useLocalStorage('lottie', null, {initializeWithValue: false})

	const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.target.files![0];
		if (file && file.type === 'application/json') {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const json = JSON.parse(e.target!.result! as any);
					setLottieData(json)
				} catch (error) {
					console.error('Error parsing JSON file:', error);
				}
			};
			reader.readAsText(file);
		} else {
			console.error('Please upload a valid JSON file.');
		}
	}

	const ref = useRef<AnimationItem | undefined>(null);

	const [jsonData, setJsonData] = useLocalStorage('scroll', ScrollToolConfig, {initializeWithValue: true})

	const {scrollDistance, frameCount} = jsonData;


	useGSAP(() => {
		if (!lottieData) {
			return
		}
		const frames = {
			frame: 0,
		};


		console.log(lottieData, 'ZDEEE')

		gsap.to(
			{},
			{
				ease: 'none',
				// yes, we can add it to an entire timeline!
				scrollTrigger: {
					trigger: '#lottie-animation',
					start: 'top top',
					end: `+=${scrollDistance}`,
					pin: true,
					scrub: true,
				},
				onUpdate: function () {
					//@ts-ignore
					const frame = Math.round(this.scrollTrigger?.progress * frameCount); // Calculate the frame based on scroll progress
					if (isNaN(frame)) {
						return;
					}
					ref.current?.goToAndStop(frame, true); // Go to that frame
				},
			},
		);
	}, {dependencies: [lottieData]})

	const [modal, setModal] = useState(false);

	const toggleModal = () => {
		setModal((v) => !v)
	}


	return (
		<>
			<div>
				<div className="h-screen overflow-hidden" id="lottie-animation">
					{lottieData &&
						<Lottie
							ref={ref}
							animationData={lottieData}
							rendererSettings={{
								preserveAspectRatio: 'xMidYMid slice',
								imagePreserveAspectRatio: 'xMidYMid slice',
							}}
							className="absolute left-[50%] top-[50%] size-full translate-x-[-50%] translate-y-[-50%]"
						/>
					}
				</div>

			</div>
			<div>
				<div className="fixed bottom-20 right-4 bg-amber-400 px-4 py-2 z-20">
					<input type="file" onChange={onChange}/>
				</div>
				<button type="button" onClick={toggleModal}
						className="fixed bottom-4 right-4 bg-amber-400 px-4 py-2 z-20">
					Upravit Config
				</button>
				{modal &&
					<div className="fixed inset-0 z-50">
						<JsonEditor
							data={jsonData}
							mode="tree"
							allowedModes={['tree', 'view', 'form']}
							history
							search
							indentation={2}
							style={{height: '500px', width: '100%', fontSize: '14px'}}
							mainMenuBar={false}
							statusBar={true}
							navigationBar={true}
							//@ts-ignore
							setData={setJsonData}
							//className="fixed inset-0 z-50"
						/>
					</div>
				}
			</div>
		</>
	)
}
