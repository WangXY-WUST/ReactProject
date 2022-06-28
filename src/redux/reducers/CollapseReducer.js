export default function  CollApsedReducer(preState = {isCollapsed:false} , action) { 
    const {type , data} = action
    switch (type) {
        case 'change_collapsed':
            // 复制一份
            let newState = {...preState}
            newState.isCollapsed = !newState.isCollapsed
            return newState
    
        default:
            return preState
    }
 }