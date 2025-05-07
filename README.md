## 🛠️ 트러블슈팅: 1️⃣ 위경도 누락 문제 해결

### 🔎 문제 상황

- 오픈 API 기반으로 수집한 공중화장실 **총 57,485건 중 25,968건(약 45%)의 위경도 좌표가 누락**되어 DB 조회에 실패
- 위치 기반 서비스의 핵심 기능인 **지도 상의 마커 표시가 절반 이상 누락**되는 문제 발생

<div align="center">

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/fcbeb512-01b8-4d82-b12b-cae84eebd5f3" width="300"/><br/>
      전체 화장실 데이터 수
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6d66bdb9-2c0b-4fc9-a84a-b8edd2fe2c4b" width="300"/><br/>
      누락된 위경도 데이터 수
    </td>
  </tr>
</table>

</div>

---

### ❌ 발생 문제

- **지도 기반 서비스 핵심 기능 마비**: 위경도 좌표 누락으로 인해 일부 화장실 데이터가 지도에 표시되지 않음
- **사용자 불편**: 반 이상의 데이터에 위치 정보가 없어 UX 저하
- **데이터 불완전**: API 응답 신뢰도 감소

---

### ✅ 해결 방법

- **Kakao 주소 검색 API**를 활용하여 누락된 주소로부터 위경도 정보를 보완
- 도로명 주소(`street_address`) 또는 지번 주소(`lot_address`) 중 사용 가능한 값을 기준으로 위경도 좌표 재요청
- **DB에 좌표 값 저장 및 반영**하여 누락된 데이터 보완

```ts
@Injectable()
export class GeocodingService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async updateMissingCoordinates(): Promise<void> {
    const toilets = await this.toiletRepository.find({
      where: [{ latitude: IsNull() }, { longitude: IsNull() }],
    });

    for (const toilet of toilets) {
      const query = toilet.street_address || toilet.lot_address;
      if (!query) continue;

      try {
        const response = await axios.get(
          'https://dapi.kakao.com/v2/local/search/address.json',
          {
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
            params: { query },
          },
        );

        const { documents } = response.data;

        if (documents.length > 0) {
          const { x, y } = documents[0];
          toilet.latitude = parseFloat(y);
          toilet.longitude = parseFloat(x);
          await this.toiletRepository.save(toilet);
        }
      } catch (error) {
        console.error(`좌표 변환 실패: ${query}`, error);
      }
    }
  }
}
```

# 트러블슈팅: 2️⃣ 소셜 로그인 개선
 
---

## ❗ 개선 전 문제점

- `passport-kakao`를 사용하여 **백엔드에서 인증, 콜백, 토큰 발급, 리디렉션까지 전부 처리**
- **프론트엔드는 로그인 직후 유저 처리 로직을 유연하게 확장하기 어려움**
- 액세스 토큰을 쿼리 파라미터에 담아 리디렉션 → **보안 및 안정성 취약**

```ts
@Public()
@Get('kakao-callback')
@UseGuards(AuthGuard('kakao')) // 'passport-kakao' 호출
@HttpCode(302)
async kakaoLogin(
  @Req() req: Request,
  @Res({ passthrough: true }) res: Response,
) {
  const socialId = req.user.socialId;

  const { accessToken, refreshToken } =
    await this.authService.getStoreTokens(socialId);

  const cookieOptions: CookieOptions = { httpOnly: true, secure: true };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // 강제 redirect, 액세스토큰을 쿼리파라미터를 사용하여 반환
  if (user.isNewUser) {
    return res.redirect(
      `https://geubddong-deploy.vercel.app/auth/callback?accessToken=${accessToken}&flag=newUser`,
    );
  }

  return res.redirect(
    `https://geubddong-deploy.vercel.app/auth/callback?accessToken=${accessToken}`,
  );
}
```

## ✅ 개선 방안

- `passport` 제거, **OAuth 인증을 직접 구현하여 구조 단순화 및 보안성 강화**
- 프론트엔드와 백엔드의 역할을 명확히 분리

<div align="center">

<table>
  <thead>
    <tr>
      <th>역할</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>FE</strong></td>
      <td>사용자를 소셜 로그인 페이지로 리다이렉트하고, <br> 인증이 완료되면 <u>code만 백엔드에 전달</u></td>
    </tr>
    <tr>
      <td><strong>BE</strong></td>
      <td>code를 소셜사에 전달해 <br> accessToken + 사용자 정보 수신 → <strong>급똥 전용 토큰 생성</strong></td>
    </tr>
  </tbody>
</table>

</div>

---

## 🆕 개선된 코드

```ts
@Public()
@Post(':provider') // kakao, google 등 동적으로 처리
async socialLogin(
  @Param('provider') provider: OAuthProvider,
  @Body() body: OAuthCodeDto,
  @Res({ passthrough: true }) res: Response,
): Promise<LoginResponseDto> {
  try {
    // 인증 코드 기반으로 유저 정보 조회
    const { user, socialId, isNewUser } =
      await this.oauthService.getOAuthUserByCode(provider, body.code);

    // 자체 토큰 생성
    const { accessToken, refreshToken } =
      await this.oauthService.getStoreTokens(socialId);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);

    return {
      statusCode: HttpStatus.OK,
      message: 'login successful',
      isNewUser,
      user: {
        user_id: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image: user.profile_image,
        provider: user.provider,
      },
    };
  } catch (error) {
    throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
```

# 트러블슈팅: 3️⃣ 캐싱 리팩토링

---

## 🔎 문제 상황

- **기존 캐싱 방식**  
  → 화장실 목록, 상세 조회, 댓글 조회 시 `userSocialId`를 포함하여 **회원 정보 + 화장실 정보**를 함께 캐싱
- **상세페이지 캐싱은 비효율적**  
  → 중복 요청 빈도가 낮아 캐시 이점이 거의 없음

---

## ❌ 발생 문제

<div align="center">

<table>
  <thead>
    <tr>
      <th>문제</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>과도한 캐시 분할</strong></td>
      <td>`userSocialId`별로 캐시가 분리되어 동일 요청도 캐시 미적중</td>
    </tr>
    <tr>
      <td><strong>메모리 낭비</strong></td>
      <td>요청 빈도가 낮은 상세페이지 데이터가 Redis 메모리 차지</td>
    </tr>
    <tr>
      <td><strong>일관성 결여</strong></td>
      <td>좋아요/댓글 변경 시 캐시 무효화 기준이 명확하지 않음</td>
    </tr>
  </tbody>
</table>

</div>

---

## ✅ 개선 방법

1. **캐시 키 재정의**
   - `userSocialId` 제거 → 사용자별 분할 제거, **화장실 정보만 캐싱**

2. **상세페이지 캐싱 제거**
   - 비중복성 높은 요청은 캐싱 대상에서 제외

3. **메인페이지(목록) 캐싱**
   - `getToilets()` 결과만 캐싱

4. **댓글 조회 캐싱**
   - `getCommentsPublic()`에서만 적용  
   - 댓글 생성/수정/삭제 시 `comments:toilet:{id}` 키를 무효화

---

## 🚀 개선 효과

<div align="center">

<table>
  <thead>
    <tr>
      <th>항목</th>
      <th>효과</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>캐시 적중률 ↑</strong></td>
      <td>동일 요청 캐시 공유로 hit rate 상승</td>
    </tr>
    <tr>
      <td><strong>메모리 사용량 ↓</strong></td>
      <td>사용 빈도 낮은 키 제거로 Redis 효율 개선</td>
    </tr>
    <tr>
      <td><strong>예측 가능한 성능</strong></td>
      <td>핵심 API 중심 캐싱으로 응답 속도 안정화</td>
    </tr>
  </tbody>
</table>

</div>

---

## 💡 개선된 캐싱 코드 

### ✅ 댓글 조회 캐싱 리팩토링

```ts
const cacheKey = `comments:toilet:${toiletId}`;
const cached = await this.redisService.get(cacheKey);
if (cached) {
  return cached;
}

const comments = await this.commentsRepository.findCommentsByToiletId(toiletId);
const result = { /* ... */ };
await this.redisService.set(cacheKey, result, 300);
return result;
```

```ts
// 기존의 문제되는 캐싱 로직 모두 주석 처리/삭제 후 단순 조회만 수행
const user = await this.usersRepository.findBySocialId(socialId);
// ...
return {
  like: !!hasLiked,
  count: totalCount,
};
```