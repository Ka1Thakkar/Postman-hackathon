import {motion} from 'framer-motion'

const Modal = ({isOpen, setIsOpen, children}) => {
    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.1, delay:0, ease: 'easeInOut'}} className="absolute z-[99999] w-full h-full flex flex-col items-center justify-center">
            {children}
        </motion.div>
    );
}
 
export default Modal;