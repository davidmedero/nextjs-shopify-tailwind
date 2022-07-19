// useSwiperRef.js
import { useState, useRef, useEffect } from 'react';

const useSwiperRef = () => {
    const [wrapper, setWrapper] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        setWrapper(ref.current);
    }, []);

    return [
        wrapper,
        ref
    ]
};

export default useSwiperRef;