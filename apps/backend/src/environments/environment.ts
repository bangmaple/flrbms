export const environment = {
  production: false,
  server: {
    host: '127.0.0.1',
    port: 5000,
  },
  database: {
    host: '34.142.156.212',
    port: 5432,
    name: 'postgres',
    username: 'admin',
    password: '12345678x@X',
    synchronize: false
  },
  keycloak: {
    host: '34.142.156.212',
    port: 9090,
    master_username: 'admin',
    master_password: '12345678x@X',
    client: {
      realm: 'master',
      id: 'authentication-api',
      secret: '6icNETyijRyra3OyUv92Kxm5fNMwDG9D',
    },
    grant_type: {
      token_exchange: 'urn:ietf:params:oauth:grant-type:token-exchange',
      refresh_token: 'urn:ietf:params:oauth:token-type:refresh_token',
      native_refresh_token: 'refresh_token',
      password: 'password'
    }
  },
  cloudinary: {
    name: "dryel0zfz",
    apiKey: "376422144959338",
    apiSecret: "9BC06IO522Z_99FHKsAqfh1K3xo",
    secure: true
  },
  firebase: {
    apiKey: "AIzaSyBu0hVHThHGd5OQLxQWnNZLSgdLGiYsfZE",
    authDomain: "fptu-library-booking.firebaseapp.com",
    projectId: "fptu-library-booking",
    storageBucket: "fptu-library-booking.appspot.com",
    messagingSenderId: "1013204251190",
    appId: "1:1013204251190:web:52aeef762a7eb980e51e97",
    measurementId: "G-MQLQ866QXQ",
    oauth: {
      clientId: "fptu-library-booking",
      audience: ["fptu-library-booking", "1013204251190-74m7mtno9e3ge4fdie3422hotor5217c.apps.googleusercontent.com",
        "fptu-library-booking.firebaseapp.com", "1013204251190-nkd63gan2a17tj8lffmh83jl6scco9g6.apps.googleusercontent.com"]
    },
    service_account: {
      "type": "service_account",
      "project_id": "fptu-library-booking",
      "private_key_id": "75d2eb543ffaa6600a670b2359913dfb35c15522",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDY4PirIWvr3G0q\nOtcHT04uamlWvHiBwXQICF9BEntV5cUa3g5SrWxDi+/1fkGzHNyeftjrWJxmkoL6\npW6zZva2m3R4HilmWvtqyR1D0d15IadyBhVPCdGi6/NBUt49RJu9NNPdT5hUDEk/\njDnvQtwH+O+YXvM1IeRV7Ln0oGdN7XTewQwoq0/iBVzdNL7GDWhMcXV2LQ6GXFvv\nwSiHDyN87Y/0aM8BxJQ1lb43lWjFTe5y3sugqOVSfGJo65Tny6T7/+jK00KYhw6P\naZFDv53l/rkcWMIxQ9FMw5oT64isdCVOmD3OdQ0BB/rUA+UphjOe8/jWbVWTYB4C\n8moA/AbPAgMBAAECggEAZUlT+SAntcSBGxrVt6069wRtY7urj/XYCbRXQB2wiiI/\n1ldkWwpxKG6fR4iKiGrvQfo9tlPw3xqHnyVJuPFaQVgCoeJ8NThCeNGqIDVP+LVV\n7TOYGgyc4jjNp3FbJ0P2c/vLAm2c14vRXaNQn0QbXIHO69tUPDky2UowYmXTORnT\nsgVBtnRDS0ZrZ1KNmQRHN/09Mz2bRD5gg7T8QAHxX0fUTXOoEdIT7AL1Rptr6rz9\nZB9mWq4d2Ovz/PyeeBFseopyzvSG9X4KicwF0jCA7euGRV+Lc0l2HJRPn1Mm5HLI\nUTdT4YsTJhDAsoyH/Lyon35CMHOGfG3JjWozzs4SeQKBgQDyKSymn0lRn6ZdeECl\nkCQSA4Sc9+Nrcb+1HAmaV+AfRL80n0gtuS1DEf4wmyKaUaOlRVu/kIujAFv7OwTT\np5p4DoMsZQiY44TbnRa/m04EKEEvoL3dGXy3nabyj5h1jWvesAtz9xweaEjFZAkN\nB27wY66QKgWnEeBTQg+t4nvkhQKBgQDlRetaH0A84HR4kTVUrLDrUpCuGZxP2cG5\nL336MKMshjD8kJ8kGjpG4CL0iPZvr2tJT4fLP7Xf13GRq1/hRWmFFelbibiUmI3N\nzyodNYj4BrAx2DsLNaFEI83nmOkTG5sTfVbORFLYdKo97s2DxUcExGSmxV2peJbR\nix1sgnPYQwKBgE4fuHb81nON1Oc8v2ZqbSiel+7oDieAp/9uzy5LAVQ1IpaAeJG/\ntvl3WZEmy3ALvIa6LJJNuK7ak9ImRTVfUfc/f1QYOEDSze7n7AneubmfnwAVlIs7\nCMBYDR8d8mqiOFW8Z8V+yESLEkcUMdNRPZoyHoQF+pLesodJvbM0aRHdAoGACS4D\nflhB+i4Ce9FUkU9YxhNIN7BO0eOmHgQIxzurTN0SmQoxVQC31J6kx6W0OESNxyGo\nDjs+zPeTVIHIFPzyfKGj9kZNXaW+B7+DsCe0lDmwVE6UDp7XFiNY2y0EJ/+y9dTO\n5PNXXdNN/azSDbSYY1h5rzO3zFFHuJwZUX7npIECgYBazFghbabwwt2wXtQVd8ai\nQg33WHU9NJTi8XNvbSefAuGAW2H7icHiTqIpKeXUH82u1y8OT2fZ+khnl/Er/Cxj\nFp8hUbMt7p96omF8SLu48NLt+1eLyyFmyN5wl0kGfjEKfiaFIPW96zA8xCZn9o06\n0T6RXR2F2AXmUMvlKOlyqw==\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-gbxgk@fptu-library-booking.iam.gserviceaccount.com",
      "client_id": "105446132021772352067",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gbxgk%40fptu-library-booking.iam.gserviceaccount.com"
    }
  },
  helmet: undefined
};
