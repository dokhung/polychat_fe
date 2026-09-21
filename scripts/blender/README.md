# Blender 캐릭터 에셋

Blender 5.2.2 LTS의 `bpy`로 생성한 독자적인 SD 캐릭터입니다. 외부 모델·텍스처·애드온은 사용하지 않습니다.

## 생성과 검증

프런트엔드 루트(`polychat_fe`)에서 실행합니다. Blender가 PATH에 없으면 실행 파일의 절대 경로를 사용하세요.

```powershell
blender --background --python scripts/blender/generate_male.py
blender --background --python scripts/blender/generate_female.py
node scripts/blender/verify_glb.mjs
npm run typecheck
npm test
npm run build
```

현재 사용하는 설치 경로는 `D:/SteamLibrary/steamapps/common/Blender/blender.exe`입니다. 기존 4.5 포터블 배포본도 `../.tools/`에 남아 있지만, 현재 원본은 5.2에서 생성했습니다.

| 결과 | 남성 | 여성 |
| --- | --- | --- |
| Blender 원본 | `assets/blender/avatar_male.blend` | `assets/blender/avatar_female.blend` |
| GLB | `public/models/characters/avatar_male.glb` | `public/models/characters/avatar_female.glb` |
| 삼각형 | 33,290 | 33,658 |
| 크기 | 약 1.17 MB | 약 1.18 MB |
| 높이 | 1.575 unit | 1.575 unit |
| 재질별 드로콜 | 26 | 27 |

## 구조와 애니메이션

세 번째 모델링은 조금 더 성숙한 SD 스타일입니다. 머리 크기를 10% 줄이고 다리를 늘려 약 3등신으로 맞췄습니다. 눈의 세로 크기와 볼의 볼륨을 줄이고, 눈썹과 앞머리를 정돈했으며, 네이비 팬츠로 변경했습니다. 메시·shape key와 rest skeleton에 동일한 비율 변환을 적용합니다. 이전 버전의 원본·GLB·생성 코드·정면 렌더는 `assets/blender/versions/chibi-v2/`에 보관했습니다.

두 번째 모델링에서 `art_surfaces.py`를 추가했습니다. 얼굴에 밀착된 눈·홍채·하이라이트, 두피 곡면을 따라 흐르는 앞머리, 연속된 bob 실루엣을 생성합니다. 티셔츠는 몸통과 소매를 remesh로 연결한 뒤 어깨에 가중치를 부여하며, 신발은 발목·발등·밑창 프로파일로 구성합니다. 원본 파일은 정면 material preview로 열리도록 설정합니다.

- Character → Armature 아래에 Body, Head, HairFront, HairSide, HairBack, Eyes, Eyebrows, Mouth, Top, Bottom, Shoes를 분리했습니다. glTF skin 내보내기의 안정성을 위해 스킨 메시의 부모는 Armature입니다.
- 18개 본. 의복·사지에는 명시적 가중치를 사용하고, 얼굴·헤어는 head에 고정합니다. 여러 세부 형상은 파츠별로 합쳐 드로콜을 줄였습니다.
- Principled BSDF 기반 재질, smooth normals, 무텍스처. 모델의 위치·회전·스케일을 메시 데이터에 적용했습니다.
- Blender는 Z-up / -Y 정면, GLB는 Y-up / +Z 정면입니다. 신발 밑면은 Y=0입니다.
- Idle, Walk, Wave, TurnAround, Run, Sit을 별도 NLA 트랙으로 내보냅니다. Blender 원본은 검토하기 쉽게 rest pose로 저장됩니다. Action Editor에서 원하는 Action을 활성화하면 재생할 수 있습니다.
- `export_character.py`는 열린 원본의 메시·본·재질·애니메이션을 선택해 내보냅니다. 독립 사용: `blender avatar_male.blend --background --python scripts/blender/export_character.py -- output.glb`.

## 프런트엔드 연결 범위

`CharacterCreator`에서 `AvatarModel`을 사용합니다. `useGLTF`, `useAnimations`, SkeletonUtils의 복제 기능으로 캐시 원본의 뼈와 재질을 공유 변경하지 않습니다. Idle 재생, reduced motion, 색상 변경, Soft 얼굴 morph, Short/Bob 헤어 교체, 성별 전환 시 짧은 스케일 전환을 지원합니다.

캐릭터 생성 단계의 헤어 선택은 실제 제작된 Short/Bob 두 가지입니다. 의상은 색상을 바꿀 수 있으며, 메시가 분리되어 있어 후속 의상 에셋으로 교체할 수 있습니다. 행성·집·프로필·상점의 공통 `Character`도 같은 GLB를 사용하며 저장된 성별·외형과 이동/달리기/감정 애니메이션을 전달합니다. 상점은 제작된 Short/Bob 헤어만 판매하며, 기존의 다른 헤어 저장값은 Bob으로 표시합니다. Orbit halo도 유지합니다.

`ModelPreview`는 PerspectiveCamera, Key/Fill/Lavender Rim 조명, contact shadow, 수평 드래그 회전을 사용합니다. 개발 서버의 `/space?preview=1`에서 Start Your Planet을 선택하면 로그인 없이 로컬 생성 화면을 확인할 수 있습니다.

## 시각 검증

```powershell
blender --background assets/blender/avatar_male.blend --python scripts/blender/render_preview.py
blender --background assets/blender/avatar_female.blend --python scripts/blender/render_preview.py
blender --background assets/blender/avatar_male.blend --python scripts/blender/render_preview.py -- Wave
blender --background assets/blender/avatar_female.blend --python scripts/blender/render_preview.py -- Walk
```

`assets/blender/previews/`에 정면·45도·측면 PNG를 생성합니다. `verify_glb.mjs`는 Three.js GLTFLoader로 실제 GLB를 읽어 높이, 지면, 파츠, 삼각형 수, 정규화된 가중치, 애니메이션의 유효성과 스킨 변형을 검사합니다. 텍스처가 없어 외부 리소스 요청이 필요하지 않습니다.
