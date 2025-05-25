package com.Kalki2.ProjectK;



import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.GetMapping;



@Controller

public class HelloController {



    @GetMapping("/hello")

    public String sayHello() {

        return "hello"; // Loads hello.html from templates/

    }

}

