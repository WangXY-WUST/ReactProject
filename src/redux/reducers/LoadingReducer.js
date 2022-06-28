export default function  LoadingReducer(preState = {isLoading:false} , action) { 
    const {type , payload} = action
    switch (type) {
        case 'change_loading':
            // 复制一份
            let newState = {...preState}
            newState.isLoading = payload
            return newState
    
        default:
            return preState
    }
 }