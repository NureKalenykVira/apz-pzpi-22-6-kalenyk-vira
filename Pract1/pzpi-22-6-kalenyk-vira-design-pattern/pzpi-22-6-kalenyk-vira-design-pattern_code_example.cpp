#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

// ��������� ������� Observer 
class Observer {
public:
    virtual void Update(int newState) = 0;
    virtual ~Observer() = default;
};

class Subject {
protected:
    std::vector<Observer*> observers;
public:
    void Attach(Observer* o) {
        observers.push_back(o);
    }

    void Detach(Observer* o) {
        observers.erase(std::remove(observers.begin(), observers.end(), o), observers.end());
    }

    void Notify(int state) {
        for (Observer* o : observers) {
            o->Update(state);
        }
    }
};

class ConcreteSubject : public Subject {
private:
    int state;
public:
    void SetState(int s) {
        state = s;
        Notify(state);
    }
};

class ConcreteObserver : public Observer {
private:
    std::string name;
    int observerState;
public:
    ConcreteObserver(std::string n) : name(n), observerState(0) {}

    void Update(int newState) override {
        observerState = newState;
        std::cout << "���������� [" << name << "]: ���� = " << observerState << "\n";
    }
};

// ������������ Observer � ��������� ����������� (GUI)
class DataModel : public Subject {
private:
    std::string value;
public:
    void SetValue(const std::string& v) {
        value = v;
        Notify(0);
    }
    std::string GetValue() const { return value; }
};

class TextLabel : public Observer {
private:
    DataModel* model;
public:
    explicit TextLabel(DataModel* m) : model(m) {}
    void Update(int) override {
        std::cout << "TextLabel: ������� �������� ����� � "
            << model->GetValue() << std::endl;
    }
};

// ������������ Observer � ����� Model�View�Controller (MVC)
class TemperatureModel : public Subject {
private:
    float temperature;
public:
    void SetTemperature(float t) {
        temperature = t;
        Notify(0);
    }
    float GetTemperature() const { return temperature; }
};

class ThermometerView : public Observer {
private:
    TemperatureModel* model;
public:
    explicit ThermometerView(TemperatureModel* m) : model(m) {}
    void Update(int) override {
        std::cout << "ThermometerView: ����������� = "
            << model->GetTemperature() << "�C\n";
    }
};

// ������������ Observer � ������ �������/�����
enum class NewsTopic { Politics, Technology };

class NewsReader : public Observer {
private:
    std::string name;
public:
    explicit NewsReader(std::string n) : name(n) {}
    void Update(int topic) override {
        std::cout << "����� [" << name << "] ������� ������: ";
        if (topic == static_cast<int>(NewsTopic::Politics))
            std::cout << "�������\n";
        else if (topic == static_cast<int>(NewsTopic::Technology))
            std::cout << "�������㳿\n";
    }
};

// ������������ Observer � ��������� ����������
class Canvas : public Subject {
private:
    int objectCount = 0;
public:
    void AddObject() {
        ++objectCount;
        Notify(objectCount);
    }
};

class LayerPanel : public Observer {
public:
    void Update(int count) override {
        std::cout << "LayerPanel: ������� �ᒺ��� �� ������ � "
            << count << std::endl;
    }
};

// ������������ Observer � ���������� ��������
class Stock : public Subject {
private:
    double price;
public:
    void SetPrice(double p) {
        price = p;
        Notify(static_cast<int>(price));
    }
};

class StockChart : public Observer {
public:
    void Update(int price) override {
        std::cout << "StockChart: ���� ���� ����� � $"
            << price << std::endl;
    }
};

int main() {
   
}
