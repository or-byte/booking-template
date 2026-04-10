import { Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import { createSignal, Show } from "solid-js";
import { MdFillAirplanemode_active, MdFillEmail, MdFillLocal_phone } from 'solid-icons/md';
import { TbOutlineWorld } from 'solid-icons/tb'
import Input from "~/components/input/Input";
import Button from "~/components/button/Button";

const MapGoogle = clientOnly(() => import("~/components/map/MapGoogle"));

export default function Contact() {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [subject, setSubject] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = () => {
    if (!firstName() || !lastName() || !email() || !subject() || !message()) {
      setError("Please fill in all fields.");
      return;
    }
    console.log({
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      subject: subject(),
      message: message(),
    });
  }

  return (
    <main class="px-4 sm:px-4 lg:px-8 py-8">
      <Title>Contact Us</Title>

      <div class="flex flex-col lg:flex-row w-full mt-5 mb-10 gap-10 lg:justify-between">
        {/* Left: contact info */}
        <div class="flex flex-col w-full lg:w-[30%] gap-8 items-center lg:items-start">
          <div class="flex flex-col gap-4 body-2 items-center lg:items-start">
            <h2 class="text-2xl font-bold">Contact Us</h2>
            <p class="text-[#5D5D5D] text-center text-justify">Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>

          <div class="flex text-[#5D5D5D] body-3 items-center lg:items-start">
            <div class="flex flex-col gap-[15px]">
              <div class="flex gap-2 items-center">
                <MdFillEmail />
                <p>Marketing@thewaterfrontbeachresort.com</p>
              </div>
              <div class="flex gap-2 items-center">
                <MdFillLocal_phone />
                <p>0917-137-9848</p>
              </div>
              <div class="flex gap-2 items-center">
                <MdFillLocal_phone />
                <p>0917-137-4375</p>
              </div>
              <div class="flex gap-2 items-center">
                <TbOutlineWorld />
                <p>thewaterfrontbeachresort.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div class="flex flex-col w-full lg:w-[50%] gap-[20px]">
          <div class="flex flex-col sm:flex-row gap-[20px] w-full">
            <Input
              class="flex-1"
              label="First Name"
              placeholder="e.g John"
              value={firstName()}
              onInput={(e) => setFirstName(e.currentTarget.value)}
            />
            <Input
              class="flex-1"
              label="Last Name"
              placeholder="e.g Doe"
              value={lastName()}
              onInput={(e) => setLastName(e.currentTarget.value)}
            />
          </div>
          <Input
            label="Email"
            placeholder="e.g sampleemail@gmail.com"
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
          <Input
            label="Subject"
            placeholder="e.g Booking Inquiry"
            value={subject()}
            onInput={(e) => setSubject(e.currentTarget.value)}
          />
          <Input
            label="Write a message"
            placeholder="Enter Message"
            value={message()}
            onInput={(e) => setMessage(e.currentTarget.value)}
          />
          <Button class="btn" onClick={handleSubmit}>
            Submit
          </Button>
          <Show when={error()}>
            <p class="text-red-500 body-3 text-left">{error()}</p>
          </Show>
        </div>
      </div>
      <MapGoogle
        origin="NAIA Terminal 1, Pasay, Metro Manila"
        destination="Waterfront Beach Resort, Bataan"
      />

      <div class="mt-10 flex flex-col gap-5 text-justify">
        <p class="font-semibold text-lg mb-5">How to get here</p>

        <div class="flex flex-col sm:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <MdFillAirplanemode_active />
              <p class="font-semibold">From NAIA (Manila International Airport)</p>
            </div>
            <p class="text-[#8E8E8E] text-sm">1. Exit airport and take a taxi or Grab to Olongapo.</p>
            <p class="text-[#8E8E8E] text-sm">2. Travel time: 1.5 – 2 hours.</p>
            <p class="text-[#8E8E8E] text-sm">3. Tell the driver: The Waterfront Beach Resort, Morong Bataan.</p>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <MdFillAirplanemode_active />
              <p class="font-semibold">From NAIA (Manila International Airport)</p>
            </div>
            <p class="text-[#8E8E8E] text-sm">1. Exit airport and take a taxi or Grab to Olongapo.</p>
            <p class="text-[#8E8E8E] text-sm">2. Travel time: 1.5 – 2 hours.</p>
            <p class="text-[#8E8E8E] text-sm">3. Tell the driver: The Waterfront Beach Resort, Morong Bataan.</p>
          </div>
        </div>
      </div>
    </main>
  );
}