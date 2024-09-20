int tombol1 = 12;
int tombol2 = 13;
int led[] = {2,3,4,5};
int buttonstate1=0;
int buttonstate2=0;
int i=0;
int k=3;

void setup() {
  // put your setup code here, to run once:
  pinMode(tombol1,INPUT);
  pinMode(tombol2,INPUT);
  Serial.begin(9600);
  for( int l=0; l<4; l++) {
    pinMode(led[l], OUTPUT);
  }
}

void loop() {
  if(i == 4 && k == -1){
    i=0;
  k=3;
  } 
  buttonstate1 = digitalRead(tombol1);
  buttonstate2 = digitalRead(tombol2);
  Serial.println(k);
  if (buttonstate1 == HIGH){
    nyala(100);
  } else if (buttonstate2 == HIGH){
    nyala(1000);
  }

}

void nyala(int delayne){
     if (i<=3 && k != 0){
    digitalWrite(led[i], HIGH);
    digitalWrite(led[i-1], LOW);
    delay(delayne);
    i++;

  } else if (k>=0){
    digitalWrite(led[k], HIGH);
    digitalWrite(led[k+1], LOW);
    k--;
     delay(delayne);
  }
}