# GameItemSim

1. 수정 및 삭제 API에서 Resource를 구분하기 위해서 어떤 방식으로 요청(Request) 하셨나요? (`param`, `query`, `body`)
- param을 이용하여 itemCode와 characterId로 Resource를 구분하였다.

2. 대표적인 HTTP Method의 4가지( `GET`, `POST`, `PUT`, `DELETE` )는 각각 어떤 상황에서 사용하였나요?
-GET : 캐릭터의 정보를 불러 올 때, 캐릭터가 착용한 아이템의 목록을 불러 올 때, 아이템의 정보를 불러 올 때, 아이템의 세부 정보를 불러 올 때
-POST : 캐릭터를 생성 할 때, 아이템을 생성 할 때, 캐릭터에게 아이템을 착용 할 때, 캐릭터에서 아이템을 제거 할 때
-PUT : 아이템의 정보를 변경 할 때
-DELETE : 캐릭터를 삭제 할 때

3. API 설계 시 RESTful한 원칙을 따랐나요? 어떤 부분이 RESTful한 설계를 반영하였고, 어떤 부분이 그렇지 않았나요?
/characters, /items 로 URL을 통해 전체 캐릭터와 아이템의 목록을 불러오게 하였고 Http 메서드인 GET, POST, PUT, DELETE를 사용해 서버에서 데이터를 불러온 후 그 결과를 JSON 형식으로 반환하였다.

4. 폴더 구조(Directory Structure)를 역할 별로 분리하였다면, 어떤 이점을 가져다 주었을까요?
routes와 schemas를 폴더로 분리하여 파일의 역할을 확실하게 해줘서 코드를 이해하기 쉽고 수정에 용이하다. 파일의 기능이 명확하기 때문에 다른 곳에서 재사용이 쉽다.