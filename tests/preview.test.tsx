import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import RotateLeftOutlined from '@ant-design/icons/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import Image from '../src';

describe('Preview', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Show preview and close', () => {
    const onPreviewCloseMock = jest.fn();
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          onVisibleChange: onPreviewCloseMock,
        }}
      />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeTruthy();

    // With mask close
    expect(onPreviewCloseMock).toBeCalledWith(true, false);
    wrapper.find('.rc-image-preview-wrap').simulate('click');

    // With btn close
    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    act(() => {
      wrapper.find('.rc-image-preview-operations-operation').at(0).simulate('click');
    });

    expect(onPreviewCloseMock).toBeCalledWith(false, true);

    onPreviewCloseMock.mockRestore();
  });

  it('Unmount', () => {
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('Rotate', () => {
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    act(() => {
      wrapper.find('.rc-image-preview-operations-operation').at(3).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(90deg)',
    });

    act(() => {
      wrapper.find('.rc-image-preview-operations-operation').at(4).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Scale', () => {
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    act(() => {
      wrapper.find('.rc-image-preview-operations-operation').at(2).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
    });

    act(() => {
      wrapper.find('.rc-image-preview-operations-operation').at(1).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(2, 2, 1) rotate(0deg)',
    });

    act(() => {
      wrapper.find('.rc-image-preview-operations-operation').at(2).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
    });

    act(() => {
      const wheelEvent = new Event('wheel');
      (wheelEvent as any).deltaY = -50;
      global.dispatchEvent(wheelEvent);
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(2, 2, 1) rotate(0deg)',
    });

    act(() => {
      const wheelEvent = new Event('wheel');
      (wheelEvent as any).deltaY = 50;
      global.dispatchEvent(wheelEvent);
      jest.runAllTimers();
      wrapper.update();
    });
    expect(wrapper.find('.rc-image-preview-img').prop('style')).toMatchObject({
      transform: 'scale3d(1, 1, 1) rotate(0deg)',
    });
  });

  it('Mouse Event', () => {
    const clientWidthMock = jest
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockImplementation(() => 1080);

    let offsetWidth = 200;
    let offsetHeight = 100;
    let left = 0;
    let top = 0;

    const imgEleMock = spyElementPrototypes(HTMLImageElement, {
      offsetWidth: {
        get: () => offsetWidth,
      },
      offsetHeight: {
        get: () => offsetHeight,
      },
      getBoundingClientRect: () => {
        return { left, top };
      },
    });
    const wrapper = mount(
      <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />,
    );

    wrapper.find('.rc-image').simulate('click');

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 2,
    });
    expect(wrapper.find('.rc-image-preview-moving').get(0)).toBeUndefined();

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    expect(wrapper.find('.rc-image-preview-moving').get(0)).toBeTruthy();

    const mousemoveEvent = new Event('mousemove');

    // @ts-ignore
    mousemoveEvent.pageX = 50;
    // @ts-ignore
    mousemoveEvent.pageY = 50;

    act(() => {
      global.dispatchEvent(mousemoveEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(50px, 50px, 0)',
    });

    const mouseupEvent = new Event('mouseup');

    act(() => {
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(0px, 0px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    act(() => {
      offsetWidth = 2000;
      offsetHeight = 1000;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(0px, 0px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    act(() => {
      left = 100;
      top = 100;
      offsetWidth = 2000;
      offsetHeight = 1000;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(460px, 116px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 2000;
      offsetHeight = 1000;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(460px, 116px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 1000;
      offsetHeight = 500;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(0px, 0px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 1200;
      offsetHeight = 600;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(-60px, -84px, 0)',
    });

    wrapper.find('.rc-image-preview-img').simulate('mousedown', {
      pageX: 0,
      pageY: 0,
      button: 0,
    });

    act(() => {
      left = -200;
      top = -200;
      offsetWidth = 1000;
      offsetHeight = 900;
      global.dispatchEvent(mouseupEvent);
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview-img-wrapper').prop('style')).toMatchObject({
      transform: 'translate3d(-40px, -66px, 0)',
    });

    // Clear
    clientWidthMock.mockRestore();
    imgEleMock.mockRestore();
    jest.restoreAllMocks();
  });

  it('PreviewGroup', () => {
    const wrapper = mount(
      <Image.PreviewGroup
        icons={{
          rotateLeft: <RotateLeftOutlined />,
          rotateRight: <RotateRightOutlined />,
          zoomIn: <ZoomInOutlined />,
          zoomOut: <ZoomOutOutlined />,
          close: <CloseOutlined />,
          left: <LeftOutlined />,
          right: <RightOutlined />,
        }}
      >
        <Image
          className="group-1"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <Image
          className="group-2"
          src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ"
        />
      </Image.PreviewGroup>,
    );

    act(() => {
      wrapper.find('.rc-image').at(0).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    act(() => {
      wrapper.find('.anticon').at(1).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.find('.rc-image-preview-wrap').simulate('click');

    act(() => {
      wrapper.find('.rc-image').at(1).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    act(() => {
      wrapper.find('.anticon').at(0).simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    wrapper.find('.rc-image-preview-wrap').simulate('click');
  });

  it('preview placeholder', () => {
    const wrapper = mount(
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          mask: 'Bamboo Is Light',
          maskClassName: 'bamboo',
        }}
      />,
    );

    expect(wrapper.find('.rc-image-mask').text()).toEqual('Bamboo Is Light');
    expect(wrapper.find('.rc-image-mask').hasClass('bamboo')).toBeTruthy();
  });

  it('previewSrc', () => {
    const src =
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/auto-orient,1/resize,p_10/quality,q_10';
    const previewSrc =
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const wrapper = mount(<Image src={src} preview={{ src: previewSrc }} />);

    expect(wrapper.find('.rc-image-img').prop('src')).toBe(src);

    expect(wrapper.find('.rc-image-preview').get(0)).toBeFalsy();

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('.rc-image-preview').get(0)).toBeTruthy();
    expect(wrapper.find('.rc-image-preview-img').prop('src')).toBe(previewSrc);
  });

  it('Customize preview props', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const wrapper = mount(
      <Image
        src={src}
        preview={{
          visible: true,
          transitionName: 'abc',
          maskTransitionName: 'def',
        }}
      />,
    );

    expect(wrapper.find('Preview').prop('transitionName')).toBe('abc');
    expect(wrapper.find('Preview').prop('maskTransitionName')).toBe('def');
  });

  it('Customize Group preview props', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const wrapper = mount(
      <Image.PreviewGroup
        preview={{ visible: true, transitionName: 'abc', maskTransitionName: 'def' }}
      >
        <Image src={src} />
      </Image.PreviewGroup>,
    );

    expect(wrapper.find('Preview').prop('transitionName')).toBe('abc');
    expect(wrapper.find('Preview').prop('maskTransitionName')).toBe('def');
  });

  it('add rootClassName should be correct', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const wrapper = mount(<Image src={src} rootClassName="custom-className" />);

    expect(wrapper.find('.custom-className').length).toBe(1);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('add rootClassName should be correct when open preview', () => {
    const src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
    const previewSrc =
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

    const wrapper = mount(
      <Image src={src} preview={{ src: previewSrc }} rootClassName="custom-className" />,
    );
    expect(wrapper.find('.rc-image.custom-className .rc-image-img').prop('src')).toBe(src);
    expect(wrapper.find('.rc-image-preview-root.custom-className').get(0)).toBeFalsy();

    act(() => {
      wrapper.find('.rc-image').simulate('click');
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper.find('.rc-image-preview-root.custom-className .rc-image-preview').get(0),
    ).toBeTruthy();
    expect(wrapper.find('.rc-image-preview-root.custom-className').get(0)).toBeTruthy();
    expect(
      wrapper.find('.rc-image-preview-root.custom-className .rc-image-preview-img').prop('src'),
    ).toBe(previewSrc);

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('if async src set should be correct', () => {
    const src =
      'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*P0S-QIRUbsUAAAAAAAAAAABkARQnAQ';
    const AsyncImage = ({ src: imgSrc }) => {
      const normalSrc =
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
      return (
        <Image.PreviewGroup>
          <Image src={imgSrc} />
          <Image src={normalSrc} />
        </Image.PreviewGroup>
      );
    };

    const wrapper = mount(<AsyncImage src="" />);

    act(() => {
      wrapper.setProps({
        src,
      });
    });

    act(() => {
      wrapper.find('.rc-image').at(0).simulate('click');
    });

    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.rc-image-preview-img').at(0).prop('src')).toBe(src);

    expect(
      wrapper
        .find('.rc-image-preview-switch-left')
        .hasClass('rc-image-preview-switch-left-disabled'),
    ).toBe(true);
  });
});
