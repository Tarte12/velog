---
title: '[Study] 03. 사용자 및 권한'
slug: Study-03.-사용자-및-권한
date: 2025-11-14T11:39:47.439Z
tags: []
---

> **서론**
MySQL만의 사용자 생성 방법, 각 계정 권한 설정 방법 차이 존재
1. 사용자 아이디 확인
2. 해당 사용자가 어느 IP에서 접속 중인지 확인
3. 역할 개념의 도입으로, 각 사용자의 권한으로 미리 준비된 권한 세트 부여 가능
=> MySQL 8.0 이상에서 계정의 식별 방식/권한/역할에 대해 인지하고, 데이터베이스의 보안에 신경 쓰자

## 3.1 사용자 식별
MySQL의 사용자는 사용자의 계정, 사용자의 접속 지점(클라이언트가 실행된 호스트명/도메인/IP 주소)도 계정의 일부가 됨
=> 따라서 MysSQL에서 계정을 언급할 땐 항상 아이디와 호스트 함께 명시 필요

- (\`): 아이디와 IP 주소를 감싸는 역따옴표로 MySQL에서 식별자를 감싸는 따옴표 역할을 함(종종 홑따옴표(')로도 바뀌어 사용)

```
`svc_id`@`127.0.0,1` //MySQL 서버가 기동 중인 로컬 호소트에서만 사용 가능한 사용자 계정
`svc_id`@`%` //모든 외부 컴퓨터에서 접속 가능한 사용자 계정
```

- if) IP 주소가 192.168.0.10인 PC에서 MySQL에 접속할 때
```
`svc_id`@`192.168.0.10` //이 계정 비번 123
`svc_id`@`%` //이 계정 비번 abcd
```
- MySQL 서버가 
1. 첫 번째 계정 정보를 이용해 인증을 실행할지
2. 두 번째 계정 정보를 이용할지

=> 권한, 계정 정보에 대해 MySQL은 기본적으로 범위가 가장 작은 것을 선택 (1번을 고를 것)

## 3.2 사용자 계정 관리
### 3.2.1 시스템 계정과 일반 계정
**시스템 계정**
- SYSTEM_USER 권한을 가진 계정
- 일반 계정처럼 사용자를 위한 계정 => 데이터베이스 서버 관리자를 위한 계정
- 일반 계정 관리(생성, 삭제, 변경) 가능
- 일반 계정: 응용 프로그램이나 개발자를 위한 계정

-> 계정 관리(계정 생성 및 삭제, 계정의 권한 부여 및 제거)
-> 다른 세션(Connection) 또는 그 세션에서 실행 중인 쿼리 강제 종료
-> 스토어드 프로그램 생성 시 DEFINER를 타 사용자로 설정

시스템 계정과 일반 계정 개념 도입 이유
- DBA(데이터베이스 관리자) 계정 계정에는 SYSTEM_USER 권한을 할당하고 일반 사용자를 위한 계정에는 SYSTEM_USER 권한을 부여하지 않게 하기 위해

MySQL 서버에 내장된 계정
- `mysql.sys`@`localhost`: MYSQL 8.0부터 기본으로 내장된 sys 스키마의 객체(뷰, 함수, 프로시저)
- `mysql.session`@`localhost`: Mysql 플러그인이 서버로 접근할 때 사용되는 계정
- `mysql.infoschema`@`localhost`: information_schema에 정의된 뷰의 DEFINER로 사용되는 계정

=> 위의 3개의 계정은 처음부터 잠겨(account_locked 칼럼) 있는 상태이므로 의도적으로 잠긴 계정을 풀지 않는 한 악의적인 용도로 사용 불가 (보안 걱정 X)

### 3.2.2 계정 생성
- 계정 생성: `CREATE USER`
- 권한 부여: `GRANT`

**계정 생성 시 설정 가능 옵션**
- 계정 인증 방식, 비밀번호
- 비밀번호 관련 옵션(비밀번호 유효 기간, 비밀번호 이력 개수, 비밀번호 재사용 불가 기간)
- 기본 역할(Role)
- SSL 옵션
- 계정 잠금 여부
```mysql
CREATE USER 'user'@'%'
	IDENTIFIED WITH 'mysql_native_password` BY 'password'
    REQUIRE NONE
    PASSWORD EXPIRE INTERVAL 30 DAY
    ACCOUNT UNLOCK
    PASSWORD HISTORY DEFAULT
    PASSWORD REUSE INTERVAL DEFAULT
    PASSWORD REQUIRE CURRENT DEFAULT;
```
#### 3.2.2.1 IDENTIFIED WITH
- 사용자의 인증 방식과 비밀번호 설정
- MySQL 서버 기본 인증 방식: IDENTIFIED BY \`password\`

MySQL이 플러그인 형태로 제공하는 인증 방식
- Native Pluggable Authentication: 비밀번호에 대한 해시(SHA-1 알고리즘) 값을 저장해 놓고, 클라이언트가 보낸 값과 해시값이 일치하는지 비교하는 인증 방식
- Caching SHA-2 Pluggable Authentication: 저장된 해시값 보안에 더 중점을 둔 알고리즘 -> 내부적으로 Salt 키를 활용하여, 수천 번의 해시 계산을 수행해 결과를 만들어 내기 때문에 키 값에 대한 결과가 달라짐
	- 해시값 계산 방식에 시간 소모가 크기 때문에 성능이 떨어지고 이것을 보완하기 위해 해시 결괏값을 메모리에 캐시해서 사용함
    - SSL/TLS or RSA 키페어를 반드시 사용해야 하며, 클라이언트에서 접속할 때 SSL 옵션 활성화 필요
- PAM Pluggable Authentication: 유닉스나 리눅스 패스워드, LDAP 같은 외부 인증을 사용할 수 있게 해 주는 인증 방식
- LDAP Pluggable Authentication: LDAP을 이용한 외부 인증을 사용할 수 있게 해 주는 인증 방식

> - 8.0부터 기본 인증 방식은 Caching SHA-2 Pluggable Authentication
- but, 보안 수준은 낮아지지만 기존 버전과의 호환성을 고려하면 Native Pluggable Authentication도 고려 대상

#### 3.2.2.2 REQUIRE
- MySQL 서버에 접속할 때 암호화된 SSL/TLS 채널을 사용할지 여부 설정
- 별도 설정 X -> 비암호화 채널로 연결
- REQUIRE 옵션을 SSL로 설정하지 않아도 Caching SHA-2 Pluggable Authentication 인증 방식 쓰면 암호돠된 채널만으로 MySQL 서버에 접속 가능
#### 3.2.2.3 PASSWORD EXPIRE
- 비밀번호 유효 기간 설정 옵션
- 별도 명시 X -> `default_password_lifetime` 시스템 변수에 저장된 기간으로 유효 기간 설정
- 개발자, DBA -> 유효 기간을 설정하는 게 보안상 안정
- 응용 프로그램 접속용 계정 -> 위험할 수 있음

**PASSWORD EXPIRE에서 설정 가능한 옵션**
- PASSWORD EXPIRE: 계정 생성과 동시에 비밀번호의 만료 처리
- PASSWORD EXPIRE NEIVER: 계정 비밀번호의 만료 기간 없음
- PASSWORD EXPIRE DEFAULT: `default_password_lifetime` 시스템 변수에 저장된 기간으로 비밀번호의 유효 기간 설정
- PASSWORD EXPIRE INTERVAL n DAY: 비밀번호의 유효 기간을 오늘부터 n일자로 설정

#### 3.2.2.4 PASSWORD HISTORY
- 한 번 사용했던 비밀번호를 재사용하지 못하게 설정하는 옵션
- 이전에 사용했던 비밀번호를 서버가 기억하고 있어야 해서 MySQL 서버가 mysql DB인 password_history 테이블 사용

**PASSWORD HISTORY에서 설정 가능한 옵션**
- PASSWORD HISTORY DEFAULT: password_history 시스템 변수에 저장된 개수만큼 비밀번호의 이력을 저장하며, 저장된 이력에 남아있는 비밀번호는 재사용 불가
- PASSWORD HISTORY n: 비밀번호의 이력을 최근 n개까지만 저장하며, 저장된 이력에 남아있는 비밀번호 재사용 불가

#### 3.2.2.5 PASSWORD REUSE INTERVAL
- 한 번 사용했던 비밀번호의 재사용 금지 기간 설정 옵션
- 별도 명시 X -> password_resue_interval 시스템 변수에 저장된 기간으로 설정

**PASSWORD REUSE INTERVAL 절에 설정 가능한 옵션**
- PASSWORD REUSE INTERVAL DEFAULT: password_resue_interval 변수에 저장된 기간으로 설정
- PASSWORD REUSE INTERVAL n DAY: n일자 이후에 비밀번호를 재사용할 수 있게 설정
#### 3.2.2.6 PASSWORD REQUIRE
- 비밀번호가 만료되어 새로운 비밀번호로 변경할 때 현재 비밀번호(변경하기 전 만료된 비밀번호)를 필요로 할지 말지 결정하는 옵션
- 별도 명시 X -> password_require_current 시스템 변수의 값으로 설정됨

**PASSWORD REQUIRE 절에 설정 가능한 옵션**
- PASSWORD REQUIRE CURRENT: 비밀번호를 변경할 떄 현재 비밀번호를 먼저 입력하도록 설정
- PASSWORD REQUIRE OPTIONAL: 비밀번호를 변경할 떄 현재 비밀번호를 입력하지 않아도 되도록 설정
- PASSWORD REQUIRE DEFAULT: password_require_current 시스템 변수의 값을 설정

#### 3.2.2.7 ACCOUNT LOCK / UNLOCK
- 계정 생성 시 또는 ALTER USER 명령을 사용해 계정 정보를 변경할 떄 계정을 사용하지 못하게 잠글지 여부 결정

**ACCOUNT LOCK / UNLOCK 절에 설정 가능한 옵션**
- ACCOUNT LOCK: 계정을 사용하지 못하게 잠금
- ACCOUNT UNLOCK: 잠긴 계정을 다시 사용 가능한 상태로 잠금 해제

## 3.3 비밀번호 관리
## 3.3.1 고수준 비밀번호
- MySQL 서버 비밀번호는 유효기간 or 이력 관리를 통한 재사용 금지 기능 뿐만 아니라 쉽게 유추할 수 있는 단어들이 사용되지 않게 **글자의 조합을 강제하거나 금칙어를 설정할 수 있는** 기능이 있음
- 비밀번호 정책은 크게 다음 3개 중에 선택 가능, 기본값은 MEDIUM으로 자동 설정
1. LOW: 비밀번호 길이만 검증
2. MEDEIUM: 비밀번호 길이 검증, 숫자/대소문자/특수문자 배합 검증
3. STRONG: MEDEIUM 레벨의 검증 모두 수행, 금칙어 포함 여부 검증

- 비밀번호 길이:`validate_password.length`
- 슷자/대소문자/특수문자: `validate_password.mixed_case_count`, `validate_password.number_count`, `validate_password.special_char_count`
- 금칙어: `validate_password.dictionary_file`
## 3.3.2 이중 비밀번호
- 일반적으로 많은 응용 프로그램 서버들이 공용으로 데이터베이스 서버 사용 => 데이터베이스 서버의 계정 정보는 응용 프로그램 서버로부터 공용으로 사용되는 경우가 많음
- 이런 구현 특성으로 인해 데이터베이스의 서버 계정 정보는 쉽게 변경 어려움 => 특히 데이터베이스 계정의 **비밀번호는 서비스 실행 중인 상태에서 변경 불가**
- 아무튼 변경하기 어려운 애니까 MySQL 8.0부터 계정의 비밀번호로 2개의 값을 동시에 사용할 수 있는 기능을 추가함 => 이게 이중 비밀번호

- 하나의 계정에 대해 2개의 비밀번호 동시 설정 가능
  - 프라이머리(Primary): 최근에 설정된 비밀번호
  - 세컨더리(Secondary): 이전 비밀번호
- 이중 비밀 비밀번호를 사용하려면 기존 비밀번호 변경 구문에 `RETAIN CURRENT PASSWORD` 옵션 추가
```MySQL
ALTER USER 'root'@'localhost' IDNTIFIED BY 'old_password';
// 비밀번호를 "ytrewq"로 설정

ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password' RETAIN CURRENT PASSWORD;
// 비밀번호를 "qwerty"로 변경하면서 기존 비밀번호를 세컨더리 비밀번호로 설정
```
1. 두 비밀번호 다 로그인 가능
2. 데이터베이스에 연결하는 응용 프로그램의 소스코드나 설정 파일의 비밀번호를 새로운 비밀번호인 'new_password'로 변경하고 배포 및 재시작 순차 실행
3. MySQL 서버에 접속하는 모든 응용 프로그램 재시작 완료 => 세컨더리 비밀번호 삭제
(꼭 삭제할 필요는 없지만 계정 보안을 위해 세컨더리 비밀번호는 삭제하는 것이 좋음)
```MySQL
ALTER USER 'root'@'localhost' DISCARD OLD PASSWORD;
```
## 3.4 권한
- 글로벌 권한 
	- 데이터베이스나 테이블 이외의 객체에 적용되는 권한
    - GRANT 명령으로 권한 부여 -> 반드시 특정 개체 명시 X
    - ALL(or ALL PRIVILEGES) 권한 부여 -> 글로벌 수준에서 가능한 모든 권한 부여
- 객체 권한
	- 데이터베이스나 테이블을 제어할 때 필요한 권한
    - GRANT 명령으로 권한 부여 -> 반드시 특정 개체 명시 필요
    - ALL(or ALL PRIVILEGES) 권한 부여 -> 해당 객체에 적용될 수 있는 모든 객체 권한 부여
    
#### 사용자에게 권한 부여
- GRANT 명령 사용
- 각 권한의 특성(범위)에 따라 GRANT 명령의 ON절에 명시되는 오브젝트(DB나 테이블)의 내용이 바뀌어야 함
```MySQL
GRANT privilege_list ON db.table TO 'user'@'host';
```
- 존재하지 않는 사용자의 경우 GRANT 명령이 실행되면 에러 발생 => 사용자를 먼저 생성하고 GRANT 권한 부여 필요
- GRANT OPTION 권한: 다른 권한과 달리 GRANT 명령 마지막에 WITH GRANT OPTIO을 명시해서 부여 필요
- privilege_list에는 구분자(,)를 써서 앞의 표에 명시된 권한 여러 개 동시 명시 가능
- TO 키워드 뒤에는 권한을 부여할 대상 명시
- ON 키워드 뒤에는 어떤 DB의 어떤 오브젝트에 권한을 부여할지 결정 가능
- **권한 범위에 따라 사용 방법 달라짐**

**글로벌 권한**
```MYSQL
GRANT SUPER ON *.* TO 'user'@'localhost';
```
- 특정 DB나 테이블에 부여될 수 없기 때문에 글로벌 권한 부여 시 GRANT 명령의 ON절에는 항상 *.* 사용
- *.* => 모든 DB의 모든 오브젝트를 포함한 mYsql 서버 전체
- CREATE USER, CREATE ROLE과 같은 글로벌 권한은 DB 단위나 오브젝트 단위로 부여할 수 있는 권한이 아니라 항상 *.*으로만 대상 사용 가능

**DB 권한**
```MYSQL
GRANT EVENT ON *.* TO 'user'@'localhost';
GRANT EVENT ON employees.* TO 'user'@'localhost';
```
- 특정 DB에 대해서만 권한을 부여하거나 서버에 존재하는 모든 DB에 대해 권한을 부여할 수 있어 둘 다 사용 가능
- 하지만 DB 권한만 부여할 경우 테이블에 대해 부여할 수 없어 테이블 명시 불가
- DB 권한은 서버의 모든 DB에 적용할 수 있으므로 대상에 *.* TKDYD RKSMD
-특정 DB에 대해서만 권한을 부여하는 것도 가능하기 떄문에 db.*도 가능
- 오브젝트 권한처럼 db.table로 오브젝트(테이블) 명시 불가

**테이블 권한**
```MYSQL
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON employees.* TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON employees.department TO 'user'@'localhost';
```
- 서버의 모든 DB에 권한 부여 가능
- 특정 DB의 오브젝트에 대해서만 권한 부여 가능
- 특정 DB의 특정 테이블에 대해서만 권한 부여 가능

**테이블 특정 칼럼에 대해서만 권한 부여하는 경우**
```MYSQL
GRANT SELECT, INSERT, UPDATE(dept_name) ON employees.department TO 'user'@'localhost';
```
- 컬럼에 부여할 수 있는 권한: `SELECT`, `INSERT`, `UPDATE`
- 각 권한 뒤 컬럼을 명시하는 형태로 부여
- 예시로는 SLELECT, INSERT는 모든 칼럼에 대해 수행 가능, UPDATE는 dept_name 칼럼에 대해서만 수행 가능

**주의**
- 테이블 or 칼럼 단위 권한은 잘 사용하지 않음
=> 칼럼 단위의 권한이 하나라도 설정되면 나머지 모든 테이블의 모든 칼럼에 대해서 권한 체크를 함 => 성능이 안 좋아질 가능성이...
- 따라서 칼럼 단위 접근 권한 => `GRANT` X, 테이블에서 권한을 허용하고자하는 컬럼만으로 별도의 뷰(VIEW)를 만들어 사용하는 방법을 생각해 볼 수 있음
- 뷰도 하나의 테이블로 인식되기 때문에 뷰를 만들어 두면 뷰의 칼럼데 대해 권한을 체크하지 않고 뷰 자체에 대한 권한만 체크함

- SHOW GRANTS 명령으로 권한/역할을 확인할 수 있지만 표 형태로 깔끔하게 볼 것이라면 mysql DB 권한 관련 테이블을 보도록 하자

## 3.5 역할
- MySQL 8.0부터 권한을 묶어 역할(Role) 사용 가능
- 역할을 사용하는 방법에 대해 알아보자

1. CREATE ROLE 명령을 통해 역할을 정의
```mysql
CREATE ROLE
	role_emp_read,
    role_emp_write;
```
2. GRANT 명령으로 각 역할에 대해 실질적인 권한 부여
```mysql
GRANT SELECT ON employees.* TO role_emp_read;
GRANT INSERT, UPDATE, DELETE ON employees.* TO role_emp_write;
```
3. 기본적으로 역할은 그 자체로 사용될 수 없고 계정에 부여해야 하므로 CREATE USER 명령으로 계정을 생성
```mysql
CREATE USER reader@'127.0.0.1' IDENTIFIED BY 'qwerty';
CREATE USER writer@'127.0.0.1' IDENTIFIED BY 'qwerty';
```
4. GRANT 명령으로 계정에 역할을 부여
```mysql
GRANT role_emp_read TO reader@'127.0.0.1';
GRANT role_emp_read,role_emp_write TO writer@'127.0.0.1';
```
5. SHOW GRANTS로 계정 가진 권한 확인 가능
6. but, 이 상태로 reader/writer 계정으로 로그인해서 employees DB 데이터를 조회하거나 변경하려고 하면 권한이 없다는 에러가 나옴
7. 계정의 활성화된 역할을 조회하도 역할이 없음을 알 수 있음
```mysql
SELECT current_role();
```
8. 역할을 쓰기 위해 활성화하려면 `SET ROLE` 명령 실행
->일단 역할이 활성화되면 그 역할이 가진 권한은 사용할 수 있는 상태가 되지만 로그아웃 후 다시 로그인하면 비활성화 상태로 초기화됨
```
SET ROLE 'role_emp_read';
```
9. 기본적으로 비활성화로 설정되어 있기 때문에, MySQL 서버에 로그인할 때 역할을 자동으로 활성할지 여부를 active_all_roles_on_login 시스템 변수로 설정 가능
- 이걸로 설정하면 SET ROLE 설정 안 해도 로그인하면 설정 됨
```
SET GLOBAL active_all_roles_on_login=ON;
```

- 역할과 계정의 차이는 account_locked 칼럼의 값이 다를 뿐 차이 X
- MySQL 서버는 계정과 권한을 어떻게 구분할까?
=> 하나의 계정에 다른 계정의 권한을 병합하기만 하면 되니까 애초에 구분할 필요가 없다
=> 그러니까 내부적으로 계정과 역할은 똑같은 객체임

- 그렇다면 호스트 부분을 가진 역할에 대해 고민해 보자
=> 역할의 호스트 부분은 아무런 영이 없음!
=> 역할을 다른 계정에 부여하지 않고 직접 로그인하는 용도로 사용한다면(실제 계정처럼) 그때 호스트 부분이 중요해짐

- 둘이 똑같은 객체인데 왜 MySQL 서버는 굳이 `CREATE ROLE`과 `CREATE USER`를 구분해서 지원할까?
=> 데이터베이스 관리의 직무를 분리할 수 있게 해서 보안을 강화하는 용도로 사용될 수 있게 하기 위해서임
- `CREATE USER` 명령에 대해서는 권한이 없지만 `CREATE ROLE` 명령만 실행 가능한 사용자는 역할을 생성할 수 있음
=> 이렇게 생성된 역할은 계정과 똑같은 객체지만 account_locked 칼럼의 값이'Y'로 설정되어 있어서 로그인 용도로 못 쓴다

- 계정의 기본 역할 or 역할에 부여된 역할 그래프 관계는 SHOW GRANTS 명령을 사용할 수 있지만 표로 보고자 한다면 mysq DB 권한 관련 테이블 참조하면 됨