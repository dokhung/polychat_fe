# Polychat Space

기존 `/space` 라우트에 구현한 로컬 3D 소셜 월드 프로토타입입니다. React Three Fiber / Drei / Three.js, 기존 Redux를 사용하며 추가 패키지를 설치하지 않았습니다.

## 실행

프로젝트에서 `npm run dev` 실행 후 로그인하여 `/space`에 진입합니다. 개발 서버에서는 `/space?preview=1`로 로그인 없이 **로컬 Mock 데이터만** 체험할 수 있습니다. 프로덕션 빌드에는 이 예외가 적용되지 않으며 기존 로그인 제한을 유지합니다.

- 첫 방문: 행성 클릭 또는 Start Your Planet → 캐릭터 성별 → 외형 → 닉네임 검사 → 무료 집 선택 → 행성 진입.
- 다음 방문: 저장된 캐릭터와 집이 우주 개요에 표시됩니다.
- WASD / 방향키 이동, Shift 달리기, 드래그 카메라 회전, 휠 줌, 가까운 오브젝트 앞 E 상호작용.
- 집: 중앙 뒤쪽. 패션: 왼쪽. 가구: 오른쪽. 방명록: 오른쪽 앞. 우편함: 집 왼쪽.
- 실내 게시판: 뒤쪽 벽. 출구: 앞쪽 초록 매트. 방명록: 왼쪽 보라색 받침대.
- Edit Room: 가구 클릭 → 바닥 드래그 → Q/E 회전 → Delete 제거 → Save room. Cancel은 저장 전 변경을 버립니다. 제거한 가구는 소유 목록에서 다시 배치할 수 있습니다.
- Settings에서 모션 감소를 켤 수 있으며 OS의 `prefers-reduced-motion`도 반영합니다.

## 수정 / 생성 파일

기존 파일 수정:

- `src/App.tsx`: 기존 Router에 `/space` 지연 로딩 적용.
- `src/store/store.ts`: 기존 Redux에 space reducer와 profile 변경 시 저장 구독 추가.
- `src/page/space/MySpaceView.tsx`: 화면 모드, 패널, 진입/퇴장 전환 조합.
- `src/page/space/space.css`: 3D 게임 HUD, 유리 패널, 반응형 스타일.

새 파일:

```text
src/page/space/
  types/space.types.ts                 도메인 타입
  data/mockSpaceData.ts                카탈로그, 초기 데이터, 상호작용 영역
  data/spaceRepository.ts              localStorage 저장/복원, Mock 닉네임 검사
  store/spaceSlice.ts                  생성, 구매, 장착, 코인, 게시글 상태
  hooks/useCharacterController.ts      키보드 입력 및 정리
  hooks/worldMovement.ts               원형 지형 경계, 건물 충돌, 가장 가까운 상호작용
  components/universe/
    UniverseScene.tsx                  Canvas, 조명, 장면 구성, 개요 카메라
    StarField.tsx                      Points 별/먼지, 먼 행성, 유성, 패럴랙스
    canvasEvents.ts                    빠른 미리보기 해제 시 이벤트 연결 보호
  components/character/
    Character.tsx                     파트별 모델과 Idle/Walk/Run/Wave/Sit
    CharacterController.tsx            이동, 회전, 추적 카메라, 근접 판정
    CharacterCreator.tsx              3단계 온보딩
    CharacterCustomizer.tsx           기본 외형 설정
    ModelPreview.tsx                  드래그/자동 회전 미리보기
  components/planet/
    PlanetEnvironment.tsx             지형, 길, 나무, 꽃, 집, 상점, 게시판
  components/home/
    HomeExterior.tsx                  3종 집, 문 애니메이션
    HomeSelector.tsx                  집 선택과 개별 3D 미리보기
    HomeInterior.tsx                  실내 공간, 가구 선택/이동
    FurnitureModel.tsx                9개 가구 카테고리 primitive 모델
    FurnitureEditor.tsx               배치 초안, 회전, 제거, 저장/취소
  components/shop/Shops.tsx            패션/가구 구매와 미리보기
  components/social/SocialPanels.tsx   방명록, 글 목록/작성/상세/좋아요/댓글
  components/hud/
    GameHud.tsx                       플레이어 정보, 코인, E 안내, 제스처
    Panel.tsx                         포커스/ESC를 지원하는 native dialog
    UtilityPanels.tsx                 설정, 소유 목록, 캐릭터 정보
tests/space.test.ts                    닉네임, 구매, 이동 경계, 저장 회귀 검사
```

## 교체 지점과 범위

- `SpaceRepository`를 서버 저장 API 어댑터로 교체할 수 있습니다. 현재 저장 키는 `space-profile`이며 **브라우저 단위**입니다. 실제 계정별 저장/동기화, 서버 닉네임 유일성 검사는 후속 작업입니다.
- 메시지/방문자/코인은 로컬 Mock입니다. Luna와 Nova는 예시 방문자이며 실제 멀티플레이 네트워크는 연결하지 않습니다.
- `Character`, `HomeExterior`, `FurnitureModel`을 GLB 자산으로 교체할 수 있습니다. 의상과 헤어는 별도 named group입니다. 현재 애니메이션은 procedural입니다.
- 보행은 허용된 1차 범위인 원형 평면이며, 구면 보행으로 교체할 수 있도록 `worldMovement`를 분리했습니다. 건물 충돌을 지원하며 나무/가구의 정밀 물리 충돌은 구현하지 않았습니다.
- 가구 종류별 하나씩 소유/배치합니다. 겹침은 허용하며 재판매, 다중 수량, 가구 크기 조절 UI는 범위 밖입니다.
- 모바일 HUD/패널 및 개요 카메라를 조정했습니다. 이동은 Desktop 키보드를 우선하며 `MovementInput`이 가상 조이스틱 연결 지점입니다.
- 우편함은 비어 있는 수신함 안내입니다. 게시판과 방명록은 로컬 기능이 동작합니다.
- 별은 Points, DPR 상한은 1.5, 그림자는 1024px입니다. 실제 기기별 60FPS 보장은 측정하지 않았습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm test`.
- 브라우저에서 Canvas와 우주/행성 렌더링, 성별/외형 선택, 중복 닉네임 거절, 캐릭터/집 생성, 저장 복원 확인.
- WASD로 집/상점/게시판에 접근, E 진입/퇴장, 가구 선택/바닥 드래그/회전/저장 확인.
- 패션 구매/장착 및 코인 차감, 가구 구매, 방명록 작성, 글 작성/상세/좋아요/댓글 확인.
- 390×844 화면에서 HUD와 개요의 행성이 화면 안에 배치되는지 확인.
- 기존 API/auth 테스트 포함 14개 회귀 테스트. Three.js 공유 번들 크기 경고, 기존 JSX transform 및 Fiber가 사용하는 Three.Clock deprecation 경고는 남습니다.
- 최종 코드의 새 브라우저 세션에서 콘솔 error 0건. 구매한 램프 추가 → Delete 제거 → 재배치 → 저장, 행성 직접 클릭 진입을 추가 확인했습니다.
