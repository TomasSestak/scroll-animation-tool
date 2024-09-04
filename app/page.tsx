"use client";
import { useGSAP } from "@gsap/react";
import {useRef, useState} from 'react';
import { ScrollToolConfig } from "@/scroll-tool-config";

import { JsonEditor } from 'json-edit-react'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocalStorage } from "usehooks-ts";

gsap.registerPlugin(ScrollTrigger);



const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));

const buffer = 1.4;
const getOpacityAndPointerEvents = (
    scrollTop: number,
    topBoundary: number,
    bottomBoundary: number,
    startVisible = false,
    endVisible = false,
) => {
  const startScroll = topBoundary;
  const endScroll = bottomBoundary;
  const midScroll = startScroll + (endScroll - startScroll) / 2;

  let opacity;

  if (scrollTop <= startScroll) {
    opacity = startVisible ? 1 : 0;
  } else if (scrollTop <= midScroll) {
    const value = (scrollTop - startScroll) / (midScroll - startScroll);
    opacity = startVisible ? clamp((1 - value) * buffer) : clamp(value * buffer);
  } else if (scrollTop <= endScroll) {
    opacity = endVisible
        ? 1
        : startVisible
            ? 0
            : clamp((1 - (scrollTop - midScroll) / (endScroll - midScroll)) * buffer);
  } else {
    opacity = endVisible ? 1 : 0;
  }

  return { opacity: String(clamp(opacity)), pointerEvents: opacity === 0 ? "none" : "auto" };
};

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [jsonData, setJsonData] = useLocalStorage("scroll", ScrollToolConfig, {initializeWithValue: true})

  const { breakpoint, scrollDistance, frameCount, canvas, blocks, backgroundColor } = jsonData;

  useGSAP(() => {
    //canvasRef.current!.width = 1158;
    //canvasRef.current!.height = 770;

    const images: HTMLImageElement[] = [];

    /*	const currentFrame = (index: number) =>
		`https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(
			index + 1
		)
			.toString()
			.padStart(4, "0")}.jpg`;*/

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      if (process.env.NODE_ENV === 'development') {
        img.src = `/img/scroll-tool/breakpoints/${breakpoint}/${i + 1}.jpg`;
      } else {
        img.src = `./img/scroll-tool/breakpoints/${breakpoint}/${i + 1}.jpg`;
      }
      //img.src = currentFrame(i);
      images.push(img);
    }

    const frames = {
      frame: 0,
    };

    const context = canvasRef.current!.getContext("2d")!;
    context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    context.drawImage(images[frames.frame], 0, 0);

    gsap.to(frames, {
      frame: frameCount - 1,
      ease: "none",
      snap: "frame",
      scrollTrigger: {
        trigger: canvasRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        markers: true,
        pin: true,
        scrub: 0.5,
      },
      onUpdate: function () {
        const context = canvasRef.current!.getContext("2d")!;
        context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        context.drawImage(images[frames.frame], 0, 0);


        blocks.forEach(({ id, visibleFromTo: [top, bottom] }) => {
          const { opacity } = getOpacityAndPointerEvents(
              //@ts-ignore
              scrollDistance * (this.scrollTrigger?.progress || 0),
              top,
              bottom,
          );
          document.getElementById(id)!.style.opacity = opacity;
        });
      },
    });
  });


  const [modal, setModal] = useState(false);


  const toggleModal = () => {
    setModal((v) => !v)
  }



  return (
      <div className="relative" style={{backgroundColor}}>
        <canvas
            id="scroll-tool-canvas"
            ref={canvasRef}
            className="h-[100vh] w-[100vw] object-cover"
            {...canvas}
        ></canvas>
        <div className="inset-0 fixed z-10">
          {blocks.map((item) => {
            return (
                <div key={item?.id} style={item?.styles} id={item?.id} className="pointer-events-none z-10">
                  {item?.text}
                </div>
            );
          })}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/scroll-tool/breakpoints/1560/1.jpg" alt=""/>
        <button type="button" onClick={toggleModal} className="fixed bottom-4 right-4 bg-amber-400 px-4 py-2 z-20">
          Upravit Config
        </button>
        {modal &&
          <div className="fixed inset-0 z-50">
            <JsonEditor
                data={ jsonData }
                mode="tree"
                allowedModes={['tree', 'view', 'form']}
                history
                search
                indentation={2}
                style={{ height: '500px', width: '100%', fontSize: '14px' }}
                mainMenuBar={false}
                statusBar={true}
                navigationBar={true}
                //@ts-ignore
                setData={ setJsonData }
                //className="fixed inset-0 z-50"
            />
          </div>
        }
      </div>
  );
}
