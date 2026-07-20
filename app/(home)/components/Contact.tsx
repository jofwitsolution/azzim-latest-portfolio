"use client";

import React, { useState } from "react";
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
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/sections/SectionHeading";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Handle form submission logic here
    // console.log(values);
    setLoading(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        {
          from_name: values.name,
          to_name: "Azzim",
          from_email: values.email,
          subject: values.subject,
          to_email: "azzimaina@gmail.com",
          message: values.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);

          toast.success(
            "Thank you. I will get back to you as soon as possible."
          );

          form.reset({
            name: "",
            email: "",
            message: "",
            subject: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          toast.error("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <section id="contact" className="section">
      <div className="max-width">
        <SectionHeading
          eyebrow="Contact"
          title="Get in Touch"
          subtitle="Interested in working together? Feel free to reach out for collaborations or just a friendly hello."
        />

        <div className="grid gap-10 max-w-[1150px] mx-auto mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <h3 className="font-bold text-[20.4px]">Contact Information</h3>

            <div className="space-y-5 md:space-y-6 mt-6">
              <div className="flex gap-4 items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform hover:scale-110">
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
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform hover:scale-110">
                  <Image
                    src={"/icons/phone.svg"}
                    width={24}
                    height={24}
                    alt="phone"
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
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform hover:scale-110">
                  <Image
                    src={"/icons/location.svg"}
                    width={24}
                    height={24}
                    alt="location"
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
                href={"https://www.linkedin.com/in/azzim-aina-uxdesigner/"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform hover:scale-110"
              >
                <Image
                  src={"/icons/linkedin-primary.svg"}
                  width={24}
                  height={24}
                  alt="linkedin"
                />
              </Link>
              <Link
                href={"https://www.x.com/azzimeme"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform hover:scale-110"
              >
                <Image
                  src={"/icons/twitter-primary.svg"}
                  width={24}
                  height={24}
                  alt="twitter"
                />
              </Link>
              <Link
                href={"https://www.behance.net/azzimaina"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform hover:scale-110"
              >
                <Image
                  src={"/icons/behance.svg"}
                  width={24}
                  height={24}
                  alt="behance"
                  className="invert-30"
                />
              </Link>
            </div>
          </div>
          <div className="w-full">
            <h3 className="font-bold text-[20.4px]">Send Me a Message</h3>
            <div className="glass w-full flex flex-col items-center gap-6 px-6 py-8 md:px-8 md:py-10 mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6 w-full"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type="text"
                            placeholder="Your name"
                            autoComplete="off"
                            className="border border-border rounded-md px-4 py-2"
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
                            disabled={loading}
                            type="email"
                            placeholder="Your email"
                            autoComplete="off"
                            className="border border-border rounded-md px-4 py-2"
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
                            disabled={loading}
                            type="text"
                            placeholder="Subject"
                            autoComplete="off"
                            className="border border-border rounded-md px-4 py-2"
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
                            disabled={loading}
                            placeholder="Your message"
                            autoComplete="off"
                            className="h-40 border border-border rounded-md px-4 py-2 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={loading}
                    className="btn-glow w-full h-12 text-white cursor-pointer rounded-full disabled:opacity-70"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? "Sending..." : "Send message"}
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
