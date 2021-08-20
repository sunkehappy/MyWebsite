---
date:           2021-08-18
category:       前端
title:          自定义React Hooks来
tags:           [React, React Hooks]
---
项目中有一些公共字典信息，量很多，而且并不会经常变，而且用的地方很多，所以我们就想用自定义的Hooks来获取并缓存数据。这样做有一个很大的好处，当获取到数据之后，调用Hooks的地方可以自动跟着刷新，如果不是Hooks，而只是普通的网络请求和缓存，就做不到这种刷新，需要用回调，观察者或者订阅来做。
<!--more-->

### 完整代码：
```JavaScript
const initialState = {
    status: 'idle',
    error: null,
    data: [],
};

// 这里用了reducer来使状态和数据更加清晰
const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...initialState, status: 'fetching' };
        case 'FETCHED':
            return { ...initialState, status: 'fetched', data: action.payload };
        case 'FETCH_ERROR':
            return { ...initialState, status: 'error', error: action.payload };
        default:
            return state;
    }
}, initialState);

const useFetch = (url) => {
    const cache = useRef({});

    useEffect(() => {
        let cancelRequest = false;
        if (!url) return;

        const fetchData = async () => {
            dispatch({ type: 'FETCHING' });
            if (cache.current[url]) {
                const data = cache.current[url];
                dispatch({ type: 'FETCHED', payload: data });
            } else {
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    cache.current[url] = data;
                    if (cancelRequest) return;
                    dispatch({ type: 'FETCHED', payload: data });
                } catch (error) {
                    if (cancelRequest) return;
                    dispatch({ type: 'FETCH_ERROR', payload: error.message });
                }
            }
        };

        fetchData();

        return function cleanup() {
            // 这里要做清理，也就是防止组件被卸载之后网络请求完成，然后更新组件
            cancelRequest = true;
        };
    }, [url]);

    return state;
};
```

### 后记
当然这里并不是一个十分通用的hooks，只能说满足了我们这个业务需求，如果是别的需求，可以考虑用成熟的第三方库，比如阿里的[React Hooks Library](https://github.com/alibaba/hooks)，里面的useRequest就带有缓存，值得参考。

### 参考：
1. [custom-react-hook-fetch-cache-data](https://www.smashingmagazine.com/2020/07/custom-react-hook-fetch-cache-data/)
