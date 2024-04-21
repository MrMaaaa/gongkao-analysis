import { useMount, useMemoizedFn, useSafeState, useCreation } from 'ahooks';
import './index.scss';
import subjectOriList from './subject.json';
import React from 'react';

interface SubjectItem {
  subjectAncestors: string[]; // 一级类目
  subjectParent: string[]; // 二级类目
  subjectName: string; // 专业名称
  subjectCode: string; // 专业代码
}

const SubjectPicker: React.FC<{
  onChange?: (item: SubjectItem) => void;
}> = (props) => {
  const [subjectList] = useSafeState<SubjectItem[]>(
    subjectOriList as unknown as SubjectItem[],
  );

  const [showList, setShowList] = useSafeState(false);
  const [inputValue, setInputValue] = useSafeState<SubjectItem | string>('');

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
    setTimeout(() => {
      setShowList(false);
    }, 300);
  });
  const onSelectSubject = useMemoizedFn((item: SubjectItem) => {
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
      return inputValue.subjectName;
    }
  }, [inputValue]);

  const subjectShowList = useCreation(() => {
    return subjectList.filter((item) => {
      if (typeof inputValue === 'string') {
        return item.subjectName.includes(inputValue);
      } else {
        return item.subjectCode === inputValue.subjectCode;
      }
    });
  }, [subjectList, inputValue]);

  return (
    <div className="subject-picker">
      <input
        className="subject-picker-input"
        type="text"
        placeholder="请输入你的专业名称或代码"
        onChange={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        value={inputShowValue}
      />
      {showList && subjectShowList.length > 0 && (
        <div className="subject-picker-list">
          {subjectShowList.map((item) => {
            return (
              <div
                key={item.subjectCode}
                className="subject-picker-list__item"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log(item);
                  onSelectSubject(item);
                }}
              >
                {item.subjectName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectPicker;
