## 简介
基于react实现的虚拟列表组件
## 安装
```bash
npm install my-react-virtual-list
```

## 使用
在线示例：[codesandbox](https://codesandbox.io/p/devbox/react-virtual-list-hzknxj)
```tsx
import VirtualList, { DIRECTION } from 'my-react-virtual-list'
import type { ItemStyle }  from 'my-react-virtual-list'
const VirtualListDemo = () => {
  const renderItem = ({style, index}: {style: ItemStyle; index: number}) => {
    return (
      <div className="Row" style={style} key={index}>
        Row #{index}
      </div>
    );
  };

  const getItemSize = (_: number) => {
    return (Math.random() * 50) + 50
  }
  
  return (
    <div className="Root">
      <VirtualList
        width={800}
        height={400}
        itemCount={300}
        renderItem={renderItem}
        itemSize={getItemSize}
        className="VirtualList"
        estimatedItemSize={50}
        scrollDirection={DIRECTION.VERTICAL}
      />
    </div>
  );
}
export default VirtualListDemo;

```


## API

### VirtualList 

| 属性              | 类型                         | 描述                                                                                         | 是否必需 |
|-------------------|------------------------------|----------------------------------------------------------------------------------------------|------------------|
| className         | `string`                     | 组件的CSS类名。                                                                              | 否       |
| style             | `React.CSSProperties`        | 自定义组件的内联样式。                                                                       | 否       |
| estimatedItemSize | `number`                     | 每个列表项的预估尺寸。用于在列表项的实际尺寸未知时提供滚动位置的估算。                      | 否       |
| height            | `number \| string`           | 虚拟列表的高度。                                                                             | 是       |
| width             | `number \| string`           | 虚拟列表的宽度。                                                                             | 否       |
| itemCount         | `number`                     | 列表中的项目总数。                                                                           | 是       |
| itemSize          | `ItemSize`                   | 每个列表项的尺寸（固定值、数组或函数）。                                                     | 是       |
| overscanCount     | `number`                     | 在可视区域外(缓冲区)预渲染的项目数量。用于减少滚动时的闪烁。                                         | 否       |
| scrollOffset      | `number`                     | 初始滚动偏移量。                                                                             | 否       |
| scrollToIndex     | `number`                     | 列表应该滚动到的项目索引。                                                                   | 否       |
| scrollToAlignment | `ALIGNMENT`                  | 滚动到项目时的对齐方式（`auto`, `start`, `center`, `end`）。                                 | 否       |
| scrollDirection   | `DIRECTION`                  | 列表的滚动方向（`horizontal`, `vertical`）。                                                 | 否       |
| onItemsRendered   | `function({startIndex, stopIndex}:RenderedRows)`                   | 列表项渲染时调用的函数。接收一个 `RenderedRows`对象                                                   | 否       |
| onScroll          | `function(offset: number, event: Event)`                   | 当列表滚动时调用的函数。接收参数`offset`滚动偏移量和事件对象`event`                                                                     | 否       |
| renderItem        | `function(ItemInfo)` | 用于渲染每个列表项的函数。接收一个`ItemInfo`对象。| 是       |

### ItemSize
```ts
type ItemSize = number | number[] | ItemSizeGetter;

type ItemSizeGetter = (index: number) => number;
```

### ItemInfo
| 属性              | 类型                         | 描述                                                                                         | 是否必需 |
|-------------------|------------------------------|----------------------------------------------------------------------------------------------|----------|
| index         | `number`                     |       列表项索引                                                                        | 是       |
| style         | `ItemStyle`                     |       列表项css属性                                                                        | 是       |

### ItemStyle
| 属性              | 类型                         | 描述                                                                                         | 是否必需 |
|-------------------|------------------------------|----------------------------------------------------------------------------------------------|----------|
| top         | `number`                     |       列表项距离可视区的上偏移量                                                                        | 是       |
| left         | `number`                     |       列表项距离可视区的左偏移量                                                                        | 是       |
| width         | `string \| number`                     |       列表项宽度                                                                     | 是       |
| height         | `number`                     |       列表项高度                                                                       | 否       |

### RenderedRows
| 属性              | 类型                         | 描述                                                                                         | 是否必需 |
|-------------------|------------------------------|----------------------------------------------------------------------------------------------|----------|
| startIndex         | `number`                     |       可视区渲染的列表项开始索引                                                                        | 是       |
| stopIndex         | `number`                     |       可视区渲染的列表项结束索引                                                                        | 是       |


### ALIGNMENT
| 值              | 描述                                                                                         |
|-------------------|----------------------------------------------------------------------------------------------|
| AUTO         |      自动对齐                                                                     |
| START         |      左对齐                                                                     |
| CENTER         |      居中对齐                                                  |
| END         |     右对齐                                                  |

### DIRECTION
| 值              | 描述                                                                                         |
|-------------------|----------------------------------------------------------------------------------------------|
| HORIZONTAL         |      虚拟列表水平方向滚动                                                                    |
| VERTICAL         |      虚拟列表垂直方向滚动                                                                     |




