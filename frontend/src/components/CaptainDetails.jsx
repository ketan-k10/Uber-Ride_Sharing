import React from 'react'
import { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import Avatar from './Avatar'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)

    return (
        <div>
            <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center justify-start gap-4'>
                    <Avatar className='h-12 w-12 rounded-full object-cover border-2 border-borderColor' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" />
                    <div>
                        <h4 className='text-lg font-serif font-semibold capitalize text-textMain leading-tight'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                        <p className='text-xs text-textMuted font-medium uppercase tracking-widest'>Captain</p>
                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-2xl font-serif font-semibold text-textMain'>₹295.20</h4>
                    <p className='text-xs text-textMuted uppercase tracking-widest'>Earned Today</p>
                </div>
            </div>

            <div className='flex p-5 bg-inputBg rounded-2xl border border-borderColor justify-around gap-2 items-start'>
                <div className='text-center'>
                    <i className="text-2xl mb-1 text-textMuted ri-timer-2-line block"></i>
                    <h5 className='text-lg font-semibold text-textMain font-serif'>10.2</h5>
                    <p className='text-xs text-textMuted'>Hours Online</p>
                </div>
                <div className='w-px bg-borderColor self-stretch'></div>
                <div className='text-center'>
                    <i className="text-2xl mb-1 text-textMuted ri-speed-up-line block"></i>
                    <h5 className='text-lg font-semibold text-textMain font-serif'>8</h5>
                    <p className='text-xs text-textMuted'>Trips Done</p>
                </div>
                <div className='w-px bg-borderColor self-stretch'></div>
                <div className='text-center'>
                    <i className="text-2xl mb-1 text-textMuted ri-booklet-line block"></i>
                    <h5 className='text-lg font-semibold text-textMain font-serif'>4.9</h5>
                    <p className='text-xs text-textMuted'>Rating</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails