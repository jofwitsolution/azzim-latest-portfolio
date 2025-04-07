"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Handle form submission logic here
    console.log(data);
  };

  return (
    <section id="contact" className="bg-light-220 padding-y">
      <div className="max-width">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-center font-bold text-black text-[24px] md:text-[30.6px] md:leading-[37px]">
            Get in Touch
          </h2>
          <div className="w-[96px] h-[4px] bg-linear-to-r from-primary-100 to-primary-200" />
          <p className="max-w-[768px] text-center mt-1 md:mt-4">
            Interested in working together? Feel free to reach out for
            collaborations or just a friendly hello.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-12 max-w-[1100px] mx-auto mt-8 md:mt-12">
          <div>
            <h3 className="font-bold text-[20.4px]">Contact Information</h3>

            <div className="space-y-5 md:space-y-6 mt-6">
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230">
                  <Image
                    src={"/icons/email.svg"}
                    width={24}
                    height={24}
                    alt="linkedin"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[15.3px]">Email</span>
                  <Link
                    className="text-[13.6px]"
                    href={"mailto: azzimaina@gmail.com"}
                  >
                    azzimaina@gmail.com
                  </Link>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230">
                  <Image
                    src={"/icons/phone.svg"}
                    width={24}
                    height={24}
                    alt="linkedin"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[15.3px]">Phone</span>
                  <Link className="text-[13.6px]" href={"tel:+2347067800204"}>
                    +234 (706) 780-0204
                  </Link>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230">
                  <Image
                    src={"/icons/location.svg"}
                    width={24}
                    height={24}
                    alt="linkedin"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[15.3px]">Location</span>
                  <span className="text-[13.6px]">Nigeria</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-[20.4px] mt-8">Connect</h3>
            <div className="flex gap-6 items-center mt-6">
              <Link
                href={"https://www.linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230"
              >
                <Image
                  src={"/icons/linkedin-primary.svg"}
                  width={24}
                  height={24}
                  alt="linkedin"
                />
              </Link>
              <Link
                href={"https://www.x.com"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230"
              >
                <Image
                  src={"/icons/twitter-primary.svg"}
                  width={24}
                  height={24}
                  alt="twitter"
                />
              </Link>
            </div>
          </div>
          <div className="max-sm:w-full">
            <h3 className="font-bold text-[20.4px]">Send Me a Message</h3>
            <div className="w-full bg-light-200 flex flex-col items-center shadow gap-6 px-6 py-8 md:px-8 md:py-10 rounded-xl mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6 w-full sm:w-[330px] md:w-[476px]"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Your name"
                            autoComplete="off"
                            className="border border-light-300 rounded-md px-4 py-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Your email"
                            autoComplete="off"
                            className="border border-light-300 rounded-md px-4 py-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Subject</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Subject"
                            autoComplete="off"
                            className="border border-light-300 rounded-md px-4 py-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message"
                            autoComplete="off"
                            className="h-40 border border-light-300 rounded-md px-4 py-2 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full h-[40px] bg-primary-100 text-light-100 hover:bg-primary-120 cursor-pointer rounded-md">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
