import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import CreateTransactionDialog from './_components/CreateTransactionDialog';
import Overview from './_components/Overview';
import History from './_components/History';

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect('/wizard');
  }

  return (
    <div className="h-full">
      <div className="border-b">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! &#128075;</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="!border-emerald-500 !bg-emerald-950 !text-white hover:!bg-emerald-700 hover:!text-white"
                >
                  New Income &#128516;
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="!border-red-500 !bg-red-950 !text-white hover:!bg-red-700 hover:!text-white"
                >
                  New Expense &#128532;
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}

export default page;
