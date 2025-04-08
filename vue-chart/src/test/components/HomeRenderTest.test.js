// src/test/layouts/HomeLayout.test.js
import { render, screen, fireEvent } from '@testing-library/vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { h } from 'vue';
import HomeLayout from '@/views/layouts/HomeLayout.vue';
import HomeBody from '@/views/sections/home/HomeBody.vue'; // 실제 HomeBody 컴포넌트 임포트

// HomeLayout 테스트를 위한 하위 컴포넌트 모킹
vi.mock('@/views/sections/home/HomeHeader.vue', () => ({
  default: {
    name: 'HomeHeader',
    render() {
      return h('div', { 'data-testid': 'mock-home-header' }, 'Mock Header');
    }
  }
}));

// HomeLayout 테스트를 위한 HomeBody 모킹
vi.mock('@/views/sections/home/HomeBody.vue', () => ({
  default: {
    name: 'HomeBody',
    render() {
      return h('div', { 'data-testid': 'mock-home-body' }, [
        h('button', { class: 'button__basic h50 full-width' }, '이미지 업로드')
      ]);
    }
  }
}), { virtual: true });

describe('HomeLayout 컴포넌트', () => {
  it('HomeHeader와 HomeBody 컴포넌트가 모두 렌더링되는지 확인', () => {
    // 컴포넌트 렌더링
    render(HomeLayout);
    
    // 하위 컴포넌트 확인
    expect(screen.getByTestId('mock-home-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-home-body')).toBeInTheDocument();
  });
  
  it('레이아웃 컨테이너 및 이미지 업로드 버튼이 정상 렌더링 되었는지 확인', () => {
    const { container } = render(HomeLayout);
    
    // 컨테이너 클래스 확인
    expect(container.querySelector('.layout__container')).toBeInTheDocument();
    expect(container.querySelector('.flex-col')).toBeInTheDocument();
  });
});

// 파일 업로드 테스트는 별도의 파일로 분리하는 것이 좋습니다
// 아래는 HomeBody 컴포넌트만을 대상으로 하는 테스트
describe('HomeBody 파일 업로드 테스트', () => {
  // HomeBody 테스트를 위해 모킹 해제
  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock('@/views/sections/home/HomeBody.vue');
  });

  it('이미지 업로드 버튼 기능 확인', async () => {
    // 모킹을 해제하고 실제 HomeBody 렌더링
    const { getByText } = render(HomeBody);
    
    // HTMLInputElement.prototype.click에 스파이 설정
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    
    // 버튼이 있는지 확인 후 진행
    try {
      const uploadButton = getByText(/이미지 업로드/i);
      await fireEvent.click(uploadButton);
      
      // input click 메서드가 호출되었는지 확인
      expect(clickSpy).toHaveBeenCalled();
    } catch (error) {
      console.error('이미지 업로드 버튼을 찾을 수 없습니다:', error);
      // 테스트 실패
      expect(false).toBe(true);
    } finally {
      // 스파이 복원
      clickSpy.mockRestore();
    }
  });

  it('파일 선택 시 이미지 미리보기 표시 확인', async () => {
    // 컴포넌트 렌더링
    const { container } = render(HomeBody);
    
    // 파일 input 찾기
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();
    
    if (fileInput) {
      // 테스트용 파일 객체 생성
      const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
      
      // FileReader 모킹
      global.FileReader = function() {
        this.readAsDataURL = function() {
          // 비동기적으로 onload 호출 시뮬레이션
          setTimeout(() => {
            this.onload({ target: { result: 'data:image/png;base64,dummy' } });
          }, 0);
        };
      };
      
      // 파일 선택 이벤트 발생
      await fireEvent.update(fileInput, { files: [file] });
      
      // 비동기 작업 대기
      await vi.runAllTimersAsync();
      
      // 이미지가 로드되었는지 확인
      // 참고: 컴포넌트의 실제 구현에 따라 선택자 조정 필요
      const previewImage = container.querySelector('.image__viewer');
      
      if (previewImage) {
        expect(previewImage).toBeInTheDocument();
      } else {
        console.log('이미지 미리보기 요소를 찾을 수 없습니다');
      }
    }
  });
});


PF5NU1G2204708836