# Recommendation Engine For Smart Permit System

The underlying implementation is a Spring Boot based Recommendation Engine for Smart Permit System.
The engine has a rest controller and handles data communication over HTTP.

## API Specifications

**Populate Data**
----
  Populates data into the database fetching it from the SOCRATA API 

* **URL**

  /data

* **Method:**

  `GET`
  
*  **URL Params**
  
   None
  
* **Data Params**

   **Required:**
     `offset=[integer]`
     `limit=[integer]`
     `size=[integer]`  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ Message : "10000 records processed successfully" }`
 
* **Error Response:**

  * **Code:** 501 INTERNAL SERVER ERROR <br />
    **Content:** `{ Message : "Something went wrong on the server" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/data?offset=0&limit=10000&size=1000",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Build Data Model**
----
 builds the datamodel for Recommendation Engine

* **URL**

  /build

* **Method:**

  `GET`
  
*  **URL Params**
  
   None
  
* **Data Params**

   None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ Message : "Data Model Generated" }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ Message : "Data Unavailable" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/build",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
**Evaluate Data Model**
----
 evaluates the datamodel for Recommendation Engine against the different similarities available in Mahout.

* **URL**

  /evaluate

* **Method:**

  `GET`
  
*  **URL Params**
  
   None
  
* **Data Params**

   None  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
                    "TanimotoCoefficientSimilarity": RMSEValue,
                    "PearsonCorrelationSimilarity": RMSEValue,
                    "EuclideanDistanceSimilarity": RMSEValue,
                    "LogLikelihoodSimilarity": RMSEValue
                  }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ Message : "Unable to generate evaluations" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/evaluate",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Generate Recommendations**
----
 generate the given number of recommendations from Recommendation Engine for the given permitId. 
 
* **URL**

  /recommend

* **Method:**

  `GET`
  
*  **URL Params**
  
   None
  
* **Data Params**

    **Required:**
           `permitId=[integer]`
           `count=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
                    {
                      "permitId": "1",
                      "permitJobType": "A1",
                      "permitType": "AL",
                      "permitSubtype": "N/A"
                    },
                    {
                      "permitId": "5",
                      "permitJobType": "A1",
                      "permitType": "PL",
                      "permitSubtype": "N/A"
                    }
                  ]`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ Message : "Unable to Generate Recommendations" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/recommend?permitId=2&count=2",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
