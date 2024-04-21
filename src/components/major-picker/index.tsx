import { useMemoizedFn, useSafeState, useCreation } from 'ahooks';
import './index.scss';
import majorOriList from './major.json';
import React from 'react';

interface MajorItem {
  majorAncestors: string[]; // 一级类目
  majorParent: string[]; // 二级类目
  majorName: string; // 专业名称
  majorCode: string; // 专业代码
}

const MajorPicker: React.FC<{
  onChange?: (item: MajorItem) => void;
}> = (props) => {
  const [majorList] = useSafeState<MajorItem[]>(
    majorOriList as unknown as MajorItem[],
  );

  const [showList, setShowList] = useSafeState(false);
  const [inputValue, setInputValue] = useSafeState<MajorItem | string>('');

  const onInput = useMemoizedFn((e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setInputValue(value);
  });
  const onFocus = useMemoizedFn(() => {
    setShowList(true);
  });
  const onBlur = useMemoizedFn(() => {
    setShowList(false);
  });
  const onClear = useMemoizedFn(() => {
    setInputValue('');
  });
  const onSelectMajor = useMemoizedFn((item: MajorItem) => {
    onInput({
      target: {
        value: item,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    props.onChange?.(item);
    setShowList(false);
  });

  const inputShowValue = useCreation(() => {
    if (typeof inputValue === 'string') {
      return inputValue;
    } else {
      return inputValue.majorName;
    }
  }, [inputValue]);

  const majorShowList = useCreation(() => {
    return majorList.filter((item) => {
      if (typeof inputValue === 'string') {
        return item.majorName.includes(inputValue);
      } else {
        return item.majorCode === inputValue.majorCode;
      }
    });
  }, [majorList, inputValue]);

  return (
    <div className="major-picker" onMouseEnter={onFocus} onMouseLeave={onBlur}>
      <input
        className="major-picker-input"
        type="text"
        placeholder="请输入你的专业名称或代码"
        onChange={onInput}
        value={inputShowValue}
      />
      {inputValue !== '' && (
        <i className="major-picker-input__clear" onClick={onClear}></i>
      )}
      {showList && majorShowList.length > 0 && (
        <div className="major-picker-list">
          {majorShowList.map((item) => {
            return (
              <div
                key={item.majorCode}
                className="major-picker-list__item"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSelectMajor(item);
                }}
              >
                {item.majorName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MajorPicker;
