'use client'

import {useEffect, useRef, useState} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {ScrollToolConfig} from '@/scroll-tool-config';
import type {AnimationItem} from 'lottie-web';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lottie from 'react-lottie-player';
import LottieData from '@/lottie/lottie.json';
import {JsonEditor} from 'json-edit-react';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Page() {

	const ref = useRef<AnimationItem | undefined>(null);

	const [jsonData, setJsonData] = useLocalStorage('scroll', ScrollToolConfig, {initializeWithValue: true})

	const {scrollDistance, frameCount} = jsonData;


	useGSAP(() => {
		const frames = {
			frame: 0,
		};


		console.log(frameCount, scrollDistance, "ZDEEE")

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
	})

	const [modal, setModal] = useState(false);

	const toggleModal = () => {
		setModal((v) => !v)
	}


	return (
		<>
			<div>
			<div className="h-screen overflow-hidden" id="lottie-animation">
				<Lottie
					ref={ref}
					animationData={LottieData}
					rendererSettings={{
						preserveAspectRatio: 'xMidYMid slice',
						imagePreserveAspectRatio: 'xMidYMid slice',
					}}
					className="absolute left-[50%] top-[50%] size-full translate-x-[-50%] translate-y-[-50%]"
				/>
			</div>

			</div>
			<div>
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
